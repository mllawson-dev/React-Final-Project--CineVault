
import { useState, useMemo, useEffect } from 'react';
import { useOMDb } from '../context/OMDbContext';
import HeroSpotlight from '../components/HeroSpotlight';
import SearchBar from '../components/SearchBar';
import SortBar from '../components/SortBar';
import MovieGrid from '../components/MovieGrid';
import Footer from '../components/Footer';
function sortMovies(movies, method) {
  const list = [...movies];
  switch (method) {
    case 'az': return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'newest': return list.sort((a, b) => b.year - a.year);
    case 'oldest': return list.sort((a, b) => a.year - b.year);
    case 'rating': return list.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
    default: return list;
  }
}
export default function HomePage({ onOpenModal }) {
  const state = useOMDb();
  const { movies, loading, error, warning, loadGenre, initialized, isSearch, activeGenre, searchQuery, page, total, goToPage, retry, clearSearch } = state;
  const [sort, setSort] = useState('curated');
  useEffect(() => { if (!initialized) loadGenre('Top20'); }, [initialized, loadGenre]);
  const sorted = useMemo(() => sortMovies(movies, sort), [movies, sort]);
  const heading = isSearch ? `Results for “${searchQuery}”` : activeGenre === 'Top20' ? 'Twenty films worth your time.' : `${activeGenre}, selected.`;
  const CollectionHeading = isSearch ? 'h1' : 'h2';
  const changePage = next => { goToPage(next); document.getElementById('discovery')?.scrollIntoView(); };
  return <>
    <main id="main-content" className="home-main" tabIndex={-1}>
      {!isSearch && <HeroSpotlight movies={movies} onOpenModal={onOpenModal} />}
      <section id="discovery" className="discovery" aria-labelledby="collection-heading">
        <div className="collection-intro"><div><p className="section-label">{isSearch ? 'Search the movie catalogue' : 'Discover your next watch'}</p><CollectionHeading id="collection-heading">{heading}</CollectionHeading></div><p>{isSearch ? 'Search results come from OMDb. Sorting applies to the current page.' : 'A curated collection, not a live ranking. Explore a title and save it for later.'}</p></div>
        <SearchBar />
        <SortBar sort={sort} onSort={setSort} count={sorted.length} total={total} page={page} isSearch={isSearch} disabled={loading} />
        <p className="sr-only" role="status" aria-live="polite">{loading ? 'Loading films.' : error ? error : isSearch ? `${total} search results. Page ${page}. ${movies.length} films loaded.` : `${movies.length} films loaded in ${activeGenre === 'Top20' ? 'Curated 20' : activeGenre}.`}</p>
        {warning && <div className="data-warning" role="status"><p>{warning}</p><button className="sort-btn" onClick={retry}>Retry collection</button></div>}
        <div className="grid-wrap" aria-busy={loading}><MovieGrid {...state} movies={sorted} onOpenModal={onOpenModal} /></div>
        {isSearch && !loading && !error && total > 10 && <div className="pagination" aria-label="Search results pagination"><button className="sort-btn" disabled={page === 1} onClick={() => changePage(page - 1)}>← Previous</button><p>Page {page} of {Math.min(100, Math.ceil(total / 10))} · {total} matches</p><button className="sort-btn" disabled={page >= Math.min(100, Math.ceil(total / 10))} onClick={() => changePage(page + 1)}>Next →</button></div>}
      </section>
    </main>
    <Footer />
  </>;
}
