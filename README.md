# CineVault — Film Discovery & Watchlist

Independent portfolio refinement of a Frontend Simplified React course final. Category: Digital Product.

## Run locally

Requires Node 22.12+.

1. Extract the ZIP, then use VS Code's **File → Open Folder** to open the extracted `cinevault` folder (the one containing `package.json`).
2. Open **Terminal → New Terminal** and run `npm ci`.
3. Copy `.env.example` to `.env.local` and set `OMDB_API_KEY` to your activated OMDb key. Alternatively, run `python3 scripts/set-omdb-key.py` to enter it privately; this option requires Python 3.
4. Run `npm start`, then open http://127.0.0.1:4181/.

Your API key is omitted from the source archive and browser bundle. Enter it again when setting up the extracted project. Restart the development or preview server whenever you change the key.

## Build and verify

- `npm run build` — production bundle in dist.
- `npm run preview` — serves the production bundle plus the local API middleware.
- `npm test` — data-service and server-endpoint tests.
- `node tests/browser.mjs` — optional fixture-based browser flow checks; requires installed Google Chrome and an environment that permits launching it. Start the local server first.

The browser runner cannot launch Chrome inside this Codex sandbox. Interaction and responsive checks were performed with the in-app browser. See QA-REPORT.md for verified scope.

## Architecture

- React Context separates discovery, watchlist, and theme state.
- The client calls /api/movies; no credential is shipped to the browser.
- server/movies.mjs validates inputs, times out upstream calls, coalesces concurrent identical requests, sanitises service errors, and caches responses for five minutes.
- api/movies.js adapts the shared handler to a Vercel Node function.
- vite.config.js exposes the same endpoint during local development and preview.
- Client requests cancel and ignore superseded work. Four workers enrich each collection while retaining successful films after partial failures.
- Native dialogs provide focus containment; dismissal restores focus to a persistent opening control.
- Search supports OMDb pagination, up to the API's 100-page limit. Sorting applies to loaded results on the current page.
- Watchlists and themes persist in this browser, with an in-memory fallback when storage is unavailable.

## Hosting preparation

This edition needs a server endpoint; uploading dist alone is insufficient for film data.

For Vercel, use the included configuration and set OMDB_API_KEY as a server environment variable. Do not use a VITE_ prefix. The site has not been deployed. API caching is bounded and local to each server process, with public responses cacheable for five minutes; it is not a shared durable cache. A larger release should add host-level rate limits and quota monitoring appropriate to the expected traffic.

## Product scope and provenance

Curated collections are editorial selections, not live rankings. Film information, ratings, and posters are provided by OMDb. CineVault is not affiliated with IMDb or a streaming service. Trailer links open YouTube searches. There are no accounts, cross-device sync, personalised recommendations, or active contact submissions. No client, research outcomes, or commercial metrics are claimed.

The /about project notes explain the brief, product journey, design decisions, engineering approach, and limitations. The existing typography and cinematic palette are retained; new styles add responsive layout and interaction tokens in src/styles/upgrade.css.

## Official references

- [OMDb API parameters and data attribution](https://www.omdbapi.com/)
- [Vite documentation](https://vite.dev/guide/)
- [Native dialog behaviour](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
