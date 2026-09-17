// ============================================================
//  CineVault — services/omdb.js
//  All OMDb API calls centralised here
// ============================================================

const BASE_URL = '/api/movies';

// In-memory cache: imdbID → full detail object
const cache = {};

// Curated IMDb IDs — Top 20 overall
export const TOP20_IDS = [
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0468569', // The Dark Knight
  'tt0071562', // The Godfather Part II
  'tt0050083', // 12 Angry Men
  'tt0108052', // Schindler's List
  'tt0167260', // The Lord of the Rings: The Return of the King
  'tt0110912', // Pulp Fiction
  'tt0060196', // The Good, the Bad and the Ugly
  'tt0137523', // Fight Club
  'tt0816692', // Interstellar
  'tt1375666', // Inception
  'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
  'tt0109830', // Forrest Gump
  'tt0167261', // The Lord of the Rings: The Two Towers
  'tt0080684', // The Empire Strikes Back
  'tt0133093', // The Matrix
  'tt0099685', // Goodfellas
  'tt0073486', // One Flew Over the Cuckoo's Nest
  'tt0047478', // Seven Samurai
];

// Curated Top 10 per genre
export const GENRE_IDS = {
  Drama: [
    'tt0111161', // Shawshank Redemption
    'tt0108052', // Schindler's List
    'tt0109830', // Forrest Gump
    'tt0073486', // One Flew Over the Cuckoo's Nest
    'tt0050083', // 12 Angry Men
    'tt0114369', // Se7en
    'tt0407887', // The Departed
    'tt1853728', // Django Unchained
    'tt14444798',// Oppenheimer
    'tt0211915', // Amélie
  ],
  Crime: [
    'tt0068646', // The Godfather
    'tt0071562', // The Godfather Part II
    'tt0110912', // Pulp Fiction
    'tt0099685', // Goodfellas
    'tt0102926', // The Silence of the Lambs
    'tt0407887', // The Departed
    'tt0114369', // Se7en
    'tt0118849', // L.A. Confidential
    'tt0364569', // Oldboy
    'tt0114814', // The Usual Suspects
  ],
  Thriller: [
    'tt0468569', // The Dark Knight
    'tt0137523', // Fight Club
    'tt0102926', // The Silence of the Lambs
    'tt0114814', // The Usual Suspects
    'tt1130884', // Shutter Island
    'tt0405094', // The Lives of Others
    'tt0816692', // Interstellar
    'tt0910970', // No Country for Old Men (corrected)
    'tt1375666', // Inception
    'tt6751668', // Parasite
  ],
  'Sci-Fi': [
    'tt1375666', // Inception
    'tt0816692', // Interstellar
    'tt0133093', // The Matrix
    'tt0080684', // The Empire Strikes Back
    'tt0062622', // 2001: A Space Odyssey
    'tt0076759', // Star Wars: A New Hope
    'tt0083658', // Blade Runner
    'tt0078748', // Alien
    'tt6710474', // Everything Everywhere All at Once
    'tt2543164', // Arrival
  ],
};

// Normalise a raw OMDb response into a clean movie object
function normalise(d) {
  return {
    imdbID:   d.imdbID,
    title:    d.Title,
    year:     parseInt(d.Year) || 0,
    genre:    d.Genre && d.Genre !== 'N/A' ? d.Genre.split(',')[0].trim() : 'Film',
    rating:   d.imdbRating !== 'N/A' ? d.imdbRating : '—',
    director: d.Director !== 'N/A' ? d.Director : 'Unknown',
    poster:   d.Poster   !== 'N/A' ? d.Poster   : null,
    desc:     d.Plot     !== 'N/A' ? d.Plot      : 'No description available.',
    runtime:  d.Runtime  !== 'N/A' ? d.Runtime   : '—',
    actors:   d.Actors   !== 'N/A' ? d.Actors    : '—',
    awards:   d.Awards   !== 'N/A' ? d.Awards    : null,
    ratings:  d.Ratings  || [],
    rated:    d.Rated    !== 'N/A' ? d.Rated     : '',
    language: d.Language !== 'N/A' ? d.Language  : '',
    country:  d.Country  !== 'N/A' ? d.Country   : '',
    fullPlot: false,
  };
}


export async function request(params, signal) {
  const res = await fetch(`${BASE_URL}?${new URLSearchParams(params)}`, { signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Movie data could not be loaded. Please try again.');
  return data;
}
export async function fetchDetail(imdbID, fullPlot = false, signal) {
  const key = `${imdbID}_${fullPlot ? 'full' : 'short'}`;
  if (cache[key]) return cache[key];
  const data = await request({ i: imdbID, plot: fullPlot ? 'full' : 'short' }, signal);
  if (data.Response !== 'True') return null;
  const movie = { ...normalise(data), fullPlot };
  cache[key] = movie;
  return movie;
}
export async function fetchBatch(ids, signal) {
  const results = new Array(ids.length);
  let cursor = 0;
  let firstError;
  await Promise.all(Array.from({ length: Math.min(4, ids.length) }, async () => {
    while (cursor < ids.length) {
      signal?.throwIfAborted();
      const index = cursor++;
      try { results[index] = await fetchDetail(ids[index], false, signal); }
      catch (error) { if (signal?.aborted) throw error; firstError ||= error; }
    }
  }));
  const movies = results.filter(Boolean);
  if (!movies.length && firstError) throw firstError;
  return { movies, failed: ids.length - movies.length };
}
export async function searchMovies(query, page = 1, signal) {
  const data = await request({ s: query, page: String(page) }, signal);
  if (data.Response !== 'True') {
    if (/not found|too many results/i.test(data.Error || '')) return { movies: [], total: 0, failed: 0 };
    throw new Error('The movie service could not complete this search. Please try again.');
  }
  const result = await fetchBatch(data.Search.map(item => item.imdbID), signal);
  return { ...result, total: Number(data.totalResults) || result.movies.length };
}
export function trailerUrl(title, year) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' ' + year + ' official trailer')}`;
}
