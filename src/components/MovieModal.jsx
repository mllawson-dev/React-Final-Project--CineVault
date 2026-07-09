import { useEffect, useState, useCallback } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { fetchDetail, trailerUrl } from '../services/omdb';

export default function MovieModal({ movie, onClose }) {
  const { toggle, isSaved } = useWatchlist();
  const [detail, setDetail] = useState(movie);
  const [imgError, setImgError] = useState(false);

  // Fetch full plot when modal opens
  useEffect(() => {
    if (!movie) return;
    setDetail(movie);
    setImgError(false);

    if (!movie.fullPlot) {
      fetchDetail(movie.imdbID, true)
        .then(full => { if (full) setDetail(full); })
        .catch(() => {});
    }
  }, [movie]);

  // Close on Escape key
  const handleKey = useCallback(e => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!movie) return null;

  const saved = isSaved(detail.imdbID);

  const detailRows = [
    ['Director', detail.director],
    ['Cast',     detail.actors],
    ['Genre',    detail.genre],
    ['Runtime',  detail.runtime],
    ['Language', detail.language],
    ['Country',  detail.country],
    ['Awards',   detail.awards],
  ].filter(([, v]) => v && v !== '—');

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Poster column */}
        <div className="modal-poster-col">
          {detail.poster && !imgError ? (
            <img
              src={detail.poster}
              alt={`${detail.title} poster`}
              className="modal-poster-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="modal-poster-fallback">{detail.title}</div>
          )}
          <button
            className={`modal-watchlist-btn${saved ? ' saved' : ''}`}
            onClick={() => toggle(detail)}
          >
            {saved ? '✓ In Watchlist' : '+ Add to Watchlist'}
          </button>
        </div>

        {/* Info column */}
        <div className="modal-info-col">
          <div className="modal-badges">
            <span className="modal-badge badge-genre">{detail.genre}</span>
            {detail.rated && <span className="modal-badge badge-genre">{detail.rated}</span>}
          </div>

          <h2 className="modal-title">{detail.title}</h2>

          <div className="modal-meta">
            <span>{detail.year}</span>
            {detail.runtime !== '—' && <span>{detail.runtime}</span>}
          </div>

          <p className="modal-plot">{detail.desc}</p>

          <div className="modal-details">
            {detailRows.map(([label, value]) => (
              <div className="modal-detail-item" key={label}>
                <div className="modal-detail-label">{label}</div>
                <div className="modal-detail-value">{value}</div>
              </div>
            ))}
          </div>

          {detail.ratings.length > 0 && (
            <div className="modal-ratings">
              {detail.ratings.map(r => (
                <div className="modal-rating-pill" key={r.Source}>
                  <div className="modal-rating-source">
                    {r.Source
                      .replace('Internet Movie Database', 'IMDb')
                      .replace('Rotten Tomatoes', 'RT')}
                  </div>
                  <div className="modal-rating-value">{r.Value}</div>
                </div>
              ))}
            </div>
          )}

          <a
            className="modal-trailer-btn"
            href={trailerUrl(detail.title, detail.year)}
            target="_blank"
            rel="noopener noreferrer"
          >
            ▶ Watch Trailer on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
