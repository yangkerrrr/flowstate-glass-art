import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  id: string;
  quantity: number;
}

interface ShippingInfo {
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

interface ProductRow {
  id: string;
  name: string;
  price: number;
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { orderId, items, shipping } = (await req.json()) as {
      orderId: string;
      items: CartItem[];
      shipping: ShippingInfo;
    };

    // Validate input
    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Capturing PayPal order:", orderId, "for user:", user.email);

    // Use service role client for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch actual prices from database to prevent price manipulation
    const productIds = items.map((item) => item.id);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price")
      .in("id", productIds);

    if (productsError || !products) {
      console.error("Failed to fetch products:", productsError);
      throw new Error("Failed to validate product prices");
    }

    // Calculate validated total from database prices
    let validatedTotal = 0;
    const validatedItems: { id: string; name: string; price: number; quantity: number }[] = [];

    for (const item of items) {
      const dbProduct = products.find((p: ProductRow) => p.id === item.id);
      if (!dbProduct) {
        throw new Error(`Product not found: ${item.id}`);
      }
      validatedTotal += Number(dbProduct.price) * item.quantity;
      validatedItems.push({
        id: dbProduct.id,
        name: dbProduct.name,
        price: Number(dbProduct.price),
        quantity: item.quantity,
      });
    }

    console.log("Validated total from database:", validatedTotal);

    const accessToken = await getPayPalAccessToken();

    // Capture the order
    const captureResponse = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!captureResponse.ok) {
      const error = await captureResponse.text();
      console.error("PayPal capture error:", error);
      throw new Error("Failed to capture payment");
    }

    const captureData = await captureResponse.json();
    console.log("Payment captured:", captureData.status);

    // Verify PayPal captured amount matches our validated total
    const paypalAmount = parseFloat(
      captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || "0"
    );

    if (Math.abs(paypalAmount - validatedTotal) > 0.01) {
      console.error("Amount mismatch!", { paypalAmount, validatedTotal });
      // Payment was captured but amounts don't match - this is suspicious
      // Log for investigation but still record the order with the PayPal amount
      console.error("WARNING: PayPal amount differs from database total");
    }

    // Store order in database using validated data
    const { error: dbError } = await supabase.from("orders").insert({
      user_email: user.email || shipping.email,
      total_amount: paypalAmount, // Use PayPal's captured amount as source of truth
      items: validatedItems, // Use validated items from database
      shipping_address: shipping,
      status: "paid",
      stripe_payment_intent_id: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
      stripe_session_id: orderId,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // Payment was successful, so we don't want to fail completely
      console.log("Payment captured but order storage failed");
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        captureId: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error capturing order:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to capture order";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
