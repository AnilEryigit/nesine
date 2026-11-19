import { fetchNesineLivePayload } from '../_lib/engine.js';

export async function onRequestPost({ request, waitUntil }) {
  try {
    const payload = await fetchNesineLivePayload();
    const res = new Response(JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=45',
      },
    });
    const cacheKey = new Request(new URL('/api/__nesine_cache_v1', request.url).toString());
    waitUntil(caches.default.put(cacheKey, res.clone()));
    return res;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}
