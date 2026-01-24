import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookUrl = Deno.env.get("DISCORD_WEBHOOK_URL");
    
    if (!webhookUrl) {
      console.error("Discord webhook URL not configured");
      return new Response(
        JSON.stringify({ error: "Webhook not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse visit data from request
    const body = await req.json().catch(() => ({}));
    const { page = "/", referrer = "", userAgent = "" } = body;

    // Get visitor info from request headers
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown";
    const country = req.headers.get("cf-ipcountry") || "Unknown";
    
    const timestamp = new Date().toISOString();

    // Send to Discord webhook (with thread_name for forum channels)
    const discordPayload = {
      thread_name: `Visit: ${page} - ${new Date().toLocaleDateString()}`,
      embeds: [
        {
          title: "🌐 New Website Visit",
          color: 0xf5f0e8, // Off-white color matching site theme
          fields: [
            {
              name: "📄 Page",
              value: page || "/",
              inline: true,
            },
            {
              name: "🌍 Country",
              value: country,
              inline: true,
            },
            {
              name: "⏰ Time",
              value: timestamp,
              inline: true,
            },
            {
              name: "🔗 Referrer",
              value: referrer || "Direct",
              inline: false,
            },
            {
              name: "🖥️ User Agent",
              value: userAgent?.substring(0, 100) || "Unknown",
              inline: false,
            },
          ],
          footer: {
            text: "SOL Apparel Analytics",
          },
          timestamp: timestamp,
        },
      ],
    };

    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      const error = await discordResponse.text();
      console.error("Discord webhook error:", error);
      throw new Error("Failed to send Discord notification");
    }

    console.log("Visit tracked:", { page, country, timestamp });

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error tracking visit:", error);
    return new Response(
      JSON.stringify({ error: "Failed to track visit" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
