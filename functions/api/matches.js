import { fetchNesineLivePayload } from '../_lib/engine.js';

export async function onRequestGet({ request, waitUntil }) {
  try {
    const cache = caches.default;
    const cacheKey = new Request(new URL('/api/__nesine_cache_v1', request.url).toString());
    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }

    const payload = await fetchNesineLivePayload();
    const res = new Response(JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=45',
      },
    });
    waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}
