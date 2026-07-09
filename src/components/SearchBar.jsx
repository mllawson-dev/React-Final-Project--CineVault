import { useState } from 'react';
import { useOMDb } from '../context/OMDbContext';

export default function SearchBar() {
  const [query, setQuery]       = useState('');
  const { search, clearSearch, loading, isSearch } = useOMDb();

  const handleSubmit = () => {
    if (query.trim()) search(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrap">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search any movie via OMDb…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          autoComplete="off"
        />
        {(query || isSearch) && (
          <button className="search-clear visible" onClick={handleClear} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>
      <button
        className="search-submit"
        onClick={handleSubmit}
        disabled={loading || !query.trim()}
      >
        {loading ? '…' : 'Search'}
      </button>
    </div>
  );
}
