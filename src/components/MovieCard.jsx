
import { useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
export default function MovieCard({ movie, onOpenModal }) {
  const { toggle, isSaved } = useWatchlist();
  const [imgError, setImgError] = useState(false);
  const saved = isSaved(movie.imdbID);
  return <article className="movie-card">
    <div className="card-poster">
      {movie.poster && !imgError ? <img src={movie.poster} alt={`${movie.title} poster`} className="card-poster-img" loading="lazy" decoding="async" width="300" height="450" onError={() => setImgError(true)} /> : <div className="card-poster-fallback">{movie.title}</div>}
      <div className="card-poster-overlay" />
      <div className="card-rating" aria-label={`IMDb rating ${movie.rating}`}>★ {movie.rating}</div>
      <div className="card-genre-badge">{movie.genre}</div>
      <button className={`card-watchlist-btn${saved ? ' saved' : ''}`} onClick={() => toggle(movie)} aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${movie.title}${saved ? ' from' : ' to'} watchlist`}>★</button>
    </div>
    <div className="card-body">
      <div className="card-year">{movie.year || 'Year unavailable'}</div>
      <h3 className="card-title"><button className="card-detail-trigger" onClick={() => onOpenModal(movie)} aria-label={`View details for ${movie.title}`}>{movie.title}</button></h3>
      <p className="card-desc">{movie.desc}</p>
      <p className="card-director">Dir. <span>{movie.director}</span></p>
    </div>
  </article>;
}
