import MovieCard from './MovieCard';

export default function MovieGrid({ movies, loading, error, onOpenModal, isSearch }) {
  if (loading) {
    return (
      <div className="movies-grid">
        <div className="search-status" style={{ gridColumn: '1 / -1' }}>
          <div className="search-spinner" />
          <p>Loading films from OMDb…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movies-grid">
        <div className="search-status" style={{ gridColumn: '1 / -1' }}>
          <strong>Oops</strong>
          {error}
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="movies-grid">
        <div className="search-status" style={{ gridColumn: '1 / -1' }}>
          <strong>No Results</strong>
          Try a different title or genre.
        </div>
      </div>
    );
  }

  return (
    <div className="movies-grid">
      {movies.map((movie, i) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onOpenModal={onOpenModal}
          isOmdb={isSearch}
          style={{ animationDelay: `${i * 0.04}s` }}
        />
      ))}
    </div>
  );
}
