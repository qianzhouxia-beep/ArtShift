/**
 * ArtShift Printful Proxy Worker
 * Deployed on Cloudflare Workers — bypasses Cloudflare challenge to api.printful.com
 *
 * Deploy: wrangler deploy (after `npm install -g wrangler` and `wrangler login`)
 * Or paste this code into the Cloudflare Workers dashboard:
 *   https://dash.cloudflare.com → Workers & Pages → Create Application
 */

export default {
  async fetch(request: Request): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow GET for security (Printful product/list endpoints are GET)
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the path from the request URL
    const url = new URL(request.url);
    const path = url.pathname;
    const printfulPath = path; // e.g. /products, /products/123/variants

    // Get Authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Forward the request to Printful API
    const printfulUrl = `https://api.printful.com${printfulPath}`;
    const printfulRequest = new Request(printfulUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'User-Agent': 'ArtShift/1.0 (artshift.zeabur.app)',
        'Accept': 'application/json',
      },
    });

    try {
      const response = await fetch(printfulRequest);
      const responseBody = await response.text();

      return new Response(responseBody, {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': response.headers.get('Content-Type') || 'application/json',
        },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: 'Proxy error', details: err.message }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
