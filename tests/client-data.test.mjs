import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchBatch, searchMovies } from '../src/services/omdb.js';
const raw = id => ({ Response: 'True', imdbID: id, Title: id, Year: '2000', Genre: 'Drama', imdbRating: '8', Director: 'Fixture', Poster: 'N/A', Plot: 'Fixture', Runtime: '100 min', Actors: 'Fixture', Awards: 'N/A', Ratings: [], Rated: 'PG', Language: 'English', Country: 'Test' });
test('batch preserves successful films when one request fails', async () => {
  const original = global.fetch;
  global.fetch = async endpoint => {
    const id = new URL(endpoint, 'http://localhost').searchParams.get('i');
    return { ok: id !== 'tt9000002', json: async () => id === 'tt9000002' ? { error: 'Unavailable' } : raw(id) };
  };
  try {
    const result = await fetchBatch(['tt9000001', 'tt9000002', 'tt9000003']);
    assert.deepEqual(result.movies.map(movie => movie.imdbID), ['tt9000001', 'tt9000003']);
    assert.equal(result.failed, 1);
  } finally { global.fetch = original; }
});
test('search forwards the requested page and returns the total count', async () => {
  const original = global.fetch;
  global.fetch = async endpoint => {
    const params = new URL(endpoint, 'http://localhost').searchParams;
    if (params.has('s')) {
      assert.equal(params.get('page'), '3');
      return { ok: true, json: async () => ({ Response: 'True', Search: [{ imdbID: 'tt9000004' }], totalResults: '25' }) };
    }
    return { ok: true, json: async () => raw(params.get('i')) };
  };
  try { const result = await searchMovies('fixture', 3); assert.equal(result.total, 25); assert.equal(result.movies.length, 1); }
  finally { global.fetch = original; }
});
test('aborted collections stop before making requests', async () => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(fetchBatch(['tt9000005'], controller.signal), { name: 'AbortError' });
});
