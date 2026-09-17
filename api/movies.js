import { handleMovieRequest } from '../server/movies.mjs';
export default async function handler(req, res) {
  const result = await handleMovieRequest(new URL(req.url, 'https://cinevault.local'), { apiKey: process.env.OMDB_API_KEY, method: req.method });
  for (const [name, value] of Object.entries(result.headers)) res.setHeader(name, value);
  res.status(result.status).json(result.body);
}
