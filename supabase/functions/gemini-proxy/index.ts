// supabase/functions/gemini-proxy/index.ts
// Supabase Edge Function — proxies requests to Gemini API
// Accepts apiKey in the request body and calls Gemini server-side (no CORS issues)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const apiKey: string = body.apiKey || Deno.env.get("GEMINI_API_KEY") || "";
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: "No API key provided" } }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const model: string = body.model || "gemini-1.5-flash";

    // Build Gemini request body (without our custom fields)
    const geminiBody = {
      contents: body.contents,
      generationConfig: body.generationConfig || { temperature: 0.1, maxOutputTokens: 8192 },
    };

    // Choose auth method based on key format
    const isNewFormat = apiKey.startsWith("AQ.");
    const geminiUrl = isNewFormat
      ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
      : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (isNewFormat) {
      headers["Authorization"] = `Bearer ${apiKey}`;
      headers["x-goog-api-key"] = apiKey;
    }

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(geminiBody),
    });

    const data = await geminiRes.json();
    return new Response(JSON.stringify(data), {
      status: geminiRes.status,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: { message: String(err) } }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
