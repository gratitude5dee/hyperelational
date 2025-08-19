import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  try {
    const { type, display_name, credentials } = await req.json();
    const id = crypto.randomUUID();
    const masked = typeof credentials === "string" ? credentials.slice(0, 3) + "***" : "submitted";
    const result = {
      id,
      type,
      display_name,
      status: "connected",
      message: "Credentials would be stored securely in Supabase Vault.",
      masked_credentials: masked,
      created_at: new Date().toISOString(),
    };
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400 });
  }
});
