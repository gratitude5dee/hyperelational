import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  try {
    const { type, params } = await req.json();
    const apiKey = Deno.env.get("KUMO_API_KEY") ?? "sk_mock_key";
    await new Promise((r) => setTimeout(r, 700));
    if (type === "churn") {
      const predictions = Array.from({ length: 8 }).map((_, i) => ({
        customer_id: `${1000 + i}`,
        churn_risk: Math.round((Math.random() * 0.7 + 0.2) * 100) / 100,
        segment: params?.segment ?? "all",
      }));
      return new Response(JSON.stringify({ type, predictions, apiKeyPresent: !!apiKey }), {
        headers: { "Content-Type": "application/json" },
      });
    } else if (type === "forecast") {
      const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const series = months.map((m, idx) => ({
        month: m,
        sales: 22000 + idx * 1500 + Math.round(Math.random() * 2000),
      }));
      return new Response(JSON.stringify({ type, series, apiKeyPresent: !!apiKey }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "unsupported_type" }), { status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400 });
  }
});
