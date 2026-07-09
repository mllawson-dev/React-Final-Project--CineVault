// ============================================================
//  CineVault — services/omdb.js
//  All OMDb API calls centralised here
// ============================================================

const API_KEY  = 'f78457a3';
const BASE_URL = 'https://www.omdbapi.com/';

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
    'tt0482571', // The Prestige
    'tt6751668', // Parasite
    'tt10298840',// Everything Everywhere All at Once
    'tt1745960', // Top Gun: Maverick
  ],
};

// Normalise a raw OMDb response into a clean movie object
function normalise(d) {
  return {
    imdbID:   d.imdbID,
    title:    d.Title,
    year:     parseInt(d.Year) || 0,
    genre:    d.Genre   !== 'N/A' ? d.Genre.split(',')[0].trim() : 'Film',
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

// Fetch a single film by IMDb ID
export async function fetchDetail(imdbID, fullPlot = false) {
  const cacheKey = `${imdbID}_${fullPlot ? 'full' : 'short'}`;
  if (cache[cacheKey]) return cache[cacheKey];
  const plot = fullPlot ? 'full' : 'short';
  const res  = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=${plot}`);
  const data = await res.json();
  if (data.Response !== 'True') return null;
  const movie = normalise(data);
  movie.fullPlot = fullPlot;
  cache[cacheKey] = movie;
  return movie;
}

// Fetch a batch of films by IMDb IDs (concurrent)
export async function fetchBatch(ids) {
  const results = await Promise.all(ids.map(id => fetchDetail(id)));
  return results.filter(Boolean);
}

// Search OMDb by text query, then enrich each result
export async function searchMovies(query) {
  const res  = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`
  );
  const data = await res.json();
  if (data.Response !== 'True') throw new Error(data.Error || 'No results found.');
  const details = await Promise.all(
    data.Search.slice(0, 12).map(item => fetchDetail(item.imdbID))
  );
  return details.filter(Boolean);
}

// Get the YouTube trailer search URL for a film
export function trailerUrl(title, year) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${title} ${year} official trailer`
  )}`;
}
