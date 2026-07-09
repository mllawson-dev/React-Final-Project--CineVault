// ============================================================
//  CineVault — services/storage.js
//  localStorage helpers — all keys in one place
// ============================================================

const KEYS = {
  watchlist: 'cinevault_watchlist',
  theme:     'cinevault_theme',
};

export function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.watchlist) || '[]');
  } catch {
    return [];
  }
}

export function saveWatchlist(list) {
  localStorage.setItem(KEYS.watchlist, JSON.stringify(list));
}

export function getTheme() {
  return localStorage.getItem(KEYS.theme) || 'dark';
}

export function saveTheme(theme) {
  localStorage.setItem(KEYS.theme, theme);
}
