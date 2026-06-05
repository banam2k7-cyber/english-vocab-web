const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: { message: "Use POST." } }, 405);
    }

    try {
      const { apiKey, endpoint, method = "POST", payload } = await request.json();

      if (!apiKey || !endpoint) {
        return jsonResponse({ error: { message: "Missing apiKey or endpoint." } }, 400);
      }

      const targetEndpoint = endpoint || "https://integrate.api.nvidia.com/v1/chat/completions";
      if (!targetEndpoint.startsWith("https://")) {
        return jsonResponse({ error: { message: "Only HTTPS endpoints are supported." } }, 400);
      }

      const upstream = await fetch(targetEndpoint, {
        method,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: method === "GET" ? undefined : JSON.stringify(payload),
      });

      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: {
          ...corsHeaders,
          "Content-Type": upstream.headers.get("Content-Type") || "application/json",
        },
      });
    } catch (error) {
      return jsonResponse({ error: { message: error.message } }, 500);
    }
  },
};

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
