
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { fetchBatch, searchMovies, TOP20_IDS, GENRE_IDS } from '../services/omdb';
const OMDbContext = createContext();
export function OMDbProvider({ children }) {
  const [state, setState] = useState({ movies: [], loading: false, error: null, warning: '', activeGenre: 'Top20', isSearch: false, searchQuery: '', page: 1, total: 0, initialized: false });
  const pending = useRef(null);
  const run = useCallback(async (selection) => {
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    setState(prev => ({ ...prev, ...selection, movies: [], loading: true, error: null, warning: '', total: 0, initialized: true }));
    try {
      const data = selection.isSearch
        ? await searchMovies(selection.searchQuery, selection.page, controller.signal)
        : await fetchBatch(selection.activeGenre === 'Top20' ? TOP20_IDS : GENRE_IDS[selection.activeGenre] || [], controller.signal);
      if (!controller.signal.aborted) setState(prev => ({ ...prev, movies: data.movies, total: data.total ?? data.movies.length, warning: data.failed ? `${data.failed} film${data.failed === 1 ? '' : 's'} could not be loaded. Retry to refresh this collection.` : '', loading: false }));
    } catch (error) {
      if (!controller.signal.aborted) setState(prev => ({ ...prev, error: error.name === 'TimeoutError' ? 'The request took too long. Please try again.' : error.message, loading: false }));
    }
  }, []);
  useEffect(() => () => pending.current?.abort(), []);
  const loadGenre = useCallback(genre => run({ activeGenre: genre, isSearch: false, searchQuery: '', page: 1 }), [run]);
  const search = useCallback(query => run({ isSearch: true, searchQuery: query.trim(), page: 1 }), [run]);
  const clearSearch = () => loadGenre(state.activeGenre);
  const goToPage = page => run({ isSearch: true, searchQuery: state.searchQuery, page });
  const retry = () => run({ activeGenre: state.activeGenre, isSearch: state.isSearch, searchQuery: state.searchQuery, page: state.page });
  return <OMDbContext.Provider value={{ ...state, loadGenre, search, clearSearch, goToPage, retry }}>{children}</OMDbContext.Provider>;
}
export const useOMDb = () => useContext(OMDbContext);
