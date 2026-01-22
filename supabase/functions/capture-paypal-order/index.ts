import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  id: string;
  name: string;
  price: number;
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
    const { orderId, items, shipping, totalAmount } = (await req.json()) as {
      orderId: string;
      items: CartItem[];
      shipping: ShippingInfo;
      totalAmount: number;
    };

    console.log("Capturing PayPal order:", orderId);

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

    // Store order in database using service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabase.from("orders").insert({
      user_email: shipping.email,
      total_amount: totalAmount,
      items: items,
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
