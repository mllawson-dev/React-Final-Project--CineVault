import { createContext, useContext, useState, useCallback } from 'react';
import { getWatchlist, saveWatchlist } from '../services/storage';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(getWatchlist);

  const toggle = useCallback((movie) => {
    setWatchlist(prev => {
      const exists = prev.some(m => m.imdbID === movie.imdbID);
      const next   = exists
        ? prev.filter(m => m.imdbID !== movie.imdbID)
        : [...prev, { imdbID: movie.imdbID, title: movie.title, year: movie.year, poster: movie.poster }];
      saveWatchlist(next);
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (imdbID) => watchlist.some(m => m.imdbID === imdbID),
    [watchlist]
  );

  const remove = useCallback((imdbID) => {
    setWatchlist(prev => {
      const next = prev.filter(m => m.imdbID !== imdbID);
      saveWatchlist(next);
      return next;
    });
  }, []);

  return (
    <WatchlistContext.Provider value={{ watchlist, toggle, isSaved, remove }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
