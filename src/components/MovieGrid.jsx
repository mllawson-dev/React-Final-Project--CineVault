
import MovieCard from './MovieCard';
export default function MovieGrid({ movies, loading, error, onOpenModal, retry, isSearch, clearSearch }) {
  if (loading) return <div className="movies-grid skeleton-grid" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton-card"><div /><span /><span /></div>)}</div>;
  if (error) return <div className="search-status"><strong>Films couldn’t be loaded</strong><p>{error}</p><button className="btn-hero-primary" onClick={retry}>Try again</button></div>;
  if (!movies.length) return <div className="search-status"><strong>No films found</strong><p>Try a more specific title or explore a curated collection.</p>{isSearch && <button className="btn-hero-primary" onClick={clearSearch}>Return to collection</button>}</div>;
  return <div className="movies-grid">{movies.map(movie => <MovieCard key={movie.imdbID} movie={movie} onOpenModal={onOpenModal} />)}</div>;
}
