
const KEYS = { watchlist: 'cinevault_watchlist', theme: 'cinevault_theme' };
export function getWatchlist() {
  try {
    const list = JSON.parse(localStorage.getItem(KEYS.watchlist) || '[]');
    return Array.isArray(list) ? list.filter(movie => movie && /^tt\d{7,10}$/.test(movie.imdbID) && typeof movie.title === 'string').slice(0, 1000) : [];
  } catch { return []; }
}
export function saveWatchlist(list) {
  try { localStorage.setItem(KEYS.watchlist, JSON.stringify(list)); return true; } catch { return false; }
}
export function getTheme() {
  try { return localStorage.getItem(KEYS.theme) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
}
export function saveTheme(theme) {
  try { localStorage.setItem(KEYS.theme, theme); } catch { /* Theme remains usable in memory. */ }
}
