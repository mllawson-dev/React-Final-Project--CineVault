import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleMovieRequest } from './server/movies.mjs';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'OMDB_');
  const installAPI = server => { server.middlewares.use('/api/movies', async (req, res) => {
    const result = await handleMovieRequest(new URL(req.url, 'http://localhost'), { apiKey: env.OMDB_API_KEY, method: req.method });
    res.writeHead(result.status, { 'Content-Type': 'application/json', ...result.headers });
    res.end(JSON.stringify(result.body));
  }); };
  return { plugins: [react(), { name: 'cinevault-api', configureServer: installAPI, configurePreviewServer: installAPI }] };
});
