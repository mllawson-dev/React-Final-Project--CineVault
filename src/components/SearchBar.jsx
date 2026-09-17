
import { useState, useEffect } from 'react';
import { useOMDb } from '../context/OMDbContext';
export default function SearchBar() {
  const { search, clearSearch, loading, isSearch, searchQuery } = useOMDb();
  const [query, setQuery] = useState(searchQuery);
  useEffect(() => { setQuery(searchQuery); }, [searchQuery]);
  return <form className="search-bar" role="search" onSubmit={e => { e.preventDefault(); if (query.trim().length >= 2) search(query); }}>
    <label className="sr-only" htmlFor="film-search">Search movie titles</label>
    <div className="search-input-wrap">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input id="film-search" type="search" className="search-input" placeholder="Search movie titles…" value={query} maxLength={100} onChange={e => setQuery(e.target.value)} autoComplete="off" />
      {(query || isSearch) && <button type="button" className="search-clear visible" onClick={() => { setQuery(''); clearSearch(); }} aria-label="Clear search and return to collection">✕</button>}
    </div>
    <button className="search-submit" disabled={query.trim().length < 2}>{loading ? 'Search again' : 'Search'}</button>
  </form>;
}
