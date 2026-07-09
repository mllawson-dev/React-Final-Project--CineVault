import { useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieCard({ movie, onOpenModal, isOmdb = false }) {
  const { toggle, isSaved } = useWatchlist();
  const [imgError, setImgError] = useState(false);
  const saved = isSaved(movie.imdbID);

  return (
    <div className="movie-card" onClick={() => onOpenModal(movie)}>
      <div className="card-poster">
        {movie.poster && !imgError ? (
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            className="card-poster-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card-poster-fallback">{movie.title}</div>
        )}
        <div className="card-poster-overlay" />
        <div className="card-rating">★ {movie.rating}</div>
        <div className="card-genre-badge">{movie.genre}</div>
        {isOmdb && <div className="omdb-badge">OMDb</div>}
        <button
          className={`card-watchlist-btn${saved ? ' saved' : ''}`}
          onClick={e => { e.stopPropagation(); toggle(movie); }}
          title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          ★
        </button>
      </div>
      <div className="card-body">
        <div className="card-year">{movie.year}</div>
        <h3 className="card-title">{movie.title}</h3>
        <p className="card-desc">{movie.desc}</p>
        <p className="card-director">Dir. <span>{movie.director}</span></p>
      </div>
    </div>
  );
}
