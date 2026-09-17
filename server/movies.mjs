const cache = new Map();
const inflight = new Map();
export async function handleMovieRequest(url, { apiKey, method = 'GET', fetcher = fetch } = {}) {
  const reply = (status, body, headers = {}) => ({ status, body, headers });
  if (method !== 'GET') return reply(405, { error: 'Only GET requests are supported.' }, { Allow: 'GET' });
  const id = url.searchParams.get('i');
  const query = url.searchParams.get('s')?.trim();
  const page = Number(url.searchParams.get('page') || 1);
  const plot = url.searchParams.get('plot') || 'short';
  if (id ? !/^tt\d{7,10}$/.test(id) || query : !query || query.length < 2 || query.length > 100) return reply(400, { error: 'Enter a movie title with 2–100 characters or a valid film ID.' });
  if (!Number.isInteger(page) || page < 1 || page > 100 || !['short', 'full'].includes(plot)) return reply(400, { error: 'Invalid page or plot option.' });
  if (!apiKey) return reply(503, { error: 'Movie data is unavailable until the server API key is configured.' });
  const params = new URLSearchParams(id ? { i: id, plot } : { s: query, page: String(page), type: 'movie' });
  const key = params.toString();
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return reply(200, hit.body, { 'Cache-Control': 'public, max-age=300' });
  try {
    if (!inflight.has(key)) {
      const task = (async () => {
        params.set('apikey', apiKey);
        const response = await fetcher(`https://www.omdbapi.com/?${params}`, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error('upstream');
        const body = await response.json();
        if (body.Response === 'False' && /key|limit|quota/i.test(body.Error || '')) throw new Error('upstream');
        if (body.Response !== 'True' && body.Response !== 'False') throw new Error('upstream');
        if (cache.size >= 500) cache.delete(cache.keys().next().value);
        cache.set(key, { body, expires: Date.now() + 300000 });
        return body;
      })();
      inflight.set(key, task);
    }
    const body = await inflight.get(key);
    return reply(200, body, { 'Cache-Control': 'public, max-age=300' });
  } catch {
    return reply(502, { error: 'The movie service is unavailable. Please try again shortly.' }, { 'Cache-Control': 'no-store' });
  } finally { inflight.delete(key); }
}
