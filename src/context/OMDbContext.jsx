import { createContext, useContext, useState, useCallback } from 'react';
import { fetchBatch, searchMovies, TOP20_IDS, GENRE_IDS } from '../services/omdb';

const OMDbContext = createContext();

export function OMDbProvider({ children }) {
  const [movies,      setMovies]      = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [activeGenre, setActiveGenre] = useState('Top20');
  const [isSearch,    setIsSearch]    = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadGenre = useCallback(async (genre) => {
    setLoading(true);
    setError(null);
    setIsSearch(false);
    setSearchQuery('');
    setActiveGenre(genre);
    try {
      const ids  = genre === 'Top20' ? TOP20_IDS : (GENRE_IDS[genre] || []);
      const data = await fetchBatch(ids);
      setMovies(data);
    } catch (e) {
      setError('Failed to load films. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setIsSearch(true);
    setSearchQuery(query);
    try {
      const data = await searchMovies(query);
      setMovies(data);
    } catch (e) {
      setError(e.message || 'No results found.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setIsSearch(false);
    setSearchQuery('');
    loadGenre(activeGenre);
  }, [activeGenre, loadGenre]);

  return (
    <OMDbContext.Provider value={{
      movies, loading, error,
      activeGenre, isSearch, searchQuery,
      loadGenre, search, clearSearch,
    }}>
      {children}
    </OMDbContext.Provider>
  );
}

export function useOMDb() {
  return useContext(OMDbContext);
}
