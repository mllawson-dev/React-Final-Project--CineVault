
import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { getWatchlist, saveWatchlist } from '../services/storage';
const WatchlistContext = createContext();
function reducer(state, action) {
  if (action.type === 'remove') {
    const movie = state.watchlist.find(item => item.imdbID === action.id);
    return { watchlist: state.watchlist.filter(item => item.imdbID !== action.id), message: `${movie?.title || 'Film'} removed from watchlist.` };
  }
  const saved = state.watchlist.some(item => item.imdbID === action.movie.imdbID);
  return { watchlist: saved ? state.watchlist.filter(item => item.imdbID !== action.movie.imdbID) : [...state.watchlist, action.movie], message: `${action.movie.title} ${saved ? 'removed from' : 'saved to'} watchlist.` };
}
export function WatchlistProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => ({ watchlist: getWatchlist(), message: '' }));
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => { setStorageAvailable(saveWatchlist(state.watchlist)); }, [state.watchlist]);
  const toggle = movie => dispatch({ type: 'toggle', movie });
  const remove = id => dispatch({ type: 'remove', id });
  const isSaved = id => state.watchlist.some(movie => movie.imdbID === id);
  return <WatchlistContext.Provider value={{ ...state, toggle, remove, isSaved, storageAvailable }}>{children}<div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{state.message}</div></WatchlistContext.Provider>;
}
export const useWatchlist = () => useContext(WatchlistContext);
