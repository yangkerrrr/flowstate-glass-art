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
  is_active: boolean;
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch(
    "https://api-m.paypal.com/v1/oauth2/token",
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
    const error = await response.text();
    console.error("PayPal auth error:", error);
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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { items, shipping } = (await req.json()) as {
      items: CartItem[];
      shipping: ShippingInfo;
    };

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid items" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Creating PayPal order for user:", user.email, "items:", items.length);

    // Fetch actual prices from database to prevent price manipulation
    const productIds = items.map((item) => item.id);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, is_active")
      .in("id", productIds);

    if (productsError || !products) {
      console.error("Failed to fetch products:", productsError);
      throw new Error("Failed to validate product prices");
    }

    // Validate all products exist and are active, calculate total using database prices
    const validatedItems: { name: string; quantity: string; unit_amount: { currency_code: string; value: string } }[] = [];
    let total = 0;

    for (const item of items) {
      const dbProduct = products.find((p: ProductRow) => p.id === item.id);
      
      if (!dbProduct) {
        return new Response(
          JSON.stringify({ error: `Product not found: ${item.id}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!dbProduct.is_active) {
        return new Response(
          JSON.stringify({ error: `Product not available: ${dbProduct.name}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (item.quantity < 1 || item.quantity > 100) {
        return new Response(
          JSON.stringify({ error: `Invalid quantity for ${dbProduct.name}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Use DATABASE price, not client-supplied price
      const itemTotal = Number(dbProduct.price) * item.quantity;
      total += itemTotal;

      validatedItems.push({
        name: dbProduct.name,
        quantity: item.quantity.toString(),
        unit_amount: {
          currency_code: "USD",
          value: Number(dbProduct.price).toFixed(2),
        },
      });
    }

    console.log("Validated total from database:", total);

    const accessToken = await getPayPalAccessToken();

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: total.toFixed(2),
              },
            },
          },
          items: validatedItems,
          shipping: {
            name: {
              full_name: shipping.name,
            },
            address: {
              address_line_1: shipping.address,
              admin_area_2: shipping.city,
              postal_code: shipping.zip,
              country_code: getCountryCode(shipping.country),
            },
          },
        },
      ],
    };

    const response = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("PayPal order creation error:", error);
      throw new Error("Failed to create PayPal order");
    }

    const order = await response.json();
    console.log("PayPal order created:", order.id, "for amount:", total);

    return new Response(
      JSON.stringify({ orderId: order.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create order";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function getCountryCode(country: string): string {
  const countryCodes: Record<string, string> = {
    "united states": "US",
    usa: "US",
    us: "US",
    "united kingdom": "GB",
    uk: "GB",
    canada: "CA",
    australia: "AU",
    germany: "DE",
    france: "FR",
    japan: "JP",
    china: "CN",
    india: "IN",
    brazil: "BR",
    mexico: "MX",
  };
  return countryCodes[country.toLowerCase()] || country.substring(0, 2).toUpperCase();
}
