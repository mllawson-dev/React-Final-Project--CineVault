import test from 'node:test';
import assert from 'node:assert/strict';
import { handleMovieRequest } from '../server/movies.mjs';
const url = query => new URL('http://localhost/api/movies?' + query);
test('validates input before making upstream calls', async () => {
  let calls = 0;
  const options = { apiKey: 'test-secret', fetcher: async () => { calls++; } };
  for (const query of ['i=bad', 's=x', 's=test&page=101', 's=test&page=1.5', 'i=tt1234567&plot=bad', 'i=tt1234567&s=test']) {
    assert.equal((await handleMovieRequest(url(query), options)).status, 400);
  }
  assert.equal(calls, 0);
  assert.equal((await handleMovieRequest(url('s=test'), { method: 'POST' })).status, 405);
});
test('missing credentials yield a useful configuration error', async () => {
  assert.equal((await handleMovieRequest(url('s=unconfigured'))).status, 503);
});
test('forwards allowed parameters, caches results, and never returns credentials', async () => {
  let calls = 0;
  const options = { apiKey: 'test-secret', fetcher: async endpoint => {
    calls++;
    const params = new URL(endpoint).searchParams;
    assert.equal(params.get('apikey'), 'test-secret');
    assert.equal(params.get('page'), '2');
    assert.equal(params.get('type'), 'movie');
    return { ok: true, json: async () => ({ Response: 'True', Search: [], totalResults: '20' }) };
  } };
  const result = await handleMovieRequest(url('s=cache-test&page=2&apikey=attacker'), options);
  await handleMovieRequest(url('s=cache-test&page=2'), options);
  assert.equal(result.status, 200);
  assert.equal(calls, 1);
  assert.ok(!JSON.stringify(result).includes('test-secret'));
});
test('concurrent identical requests share one upstream operation', async () => {
  let calls = 0;
  const options = { apiKey: 'test-secret', fetcher: async () => {
    calls++; await new Promise(resolve => setTimeout(resolve, 15));
    return { ok: true, json: async () => ({ Response: 'True', Title: 'Fixture' }) };
  } };
  const results = await Promise.all([handleMovieRequest(url('i=tt9999991'), options), handleMovieRequest(url('i=tt9999991'), options)]);
  assert.equal(calls, 1); assert.ok(results.every(result => result.status === 200));
});
test('upstream failures and key errors are sanitised and not cached', async () => {
  let calls = 0;
  const options = { apiKey: 'secret', fetcher: async () => {
    calls++; return { ok: true, json: async () => ({ Response: 'False', Error: 'Invalid API key: secret' }) };
  } };
  const first = await handleMovieRequest(url('s=failure-test'), options);
  await handleMovieRequest(url('s=failure-test'), options);
  assert.equal(first.status, 502); assert.equal(calls, 2);
  assert.ok(!JSON.stringify(first).includes('secret'));
  assert.equal(first.headers['Cache-Control'], 'no-store');
});
