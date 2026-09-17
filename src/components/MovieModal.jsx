import { useEffect, useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { fetchDetail, trailerUrl } from '../services/omdb';
import useDialog from './useDialog';
export default function MovieModal({ movie, onClose }) {
  const dialog = useDialog(onClose);
  const { toggle, isSaved, message } = useWatchlist();
  const [detail, setDetail] = useState(movie);
  const [imgError, setImgError] = useState(false);
  const [status, setStatus] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setDetail(movie); setImgError(false);
    if (!movie.fullPlot) {
      setStatus('Loading full film details…');
      fetchDetail(movie.imdbID, true, controller.signal).then(full => {
        if (!controller.signal.aborted) { if (full) setDetail(full); setStatus(full ? '' : 'Full details are unavailable.'); }
      }).catch(() => { if (!controller.signal.aborted) setStatus('Full details couldn’t be loaded. Your saved film is still available.'); });
    }
    return () => controller.abort();
  }, [movie, attempt]);
  const saved = isSaved(detail.imdbID);
  const rows = [['Director', detail.director], ['Cast', detail.actors], ['Genre', detail.genre], ['Runtime', detail.runtime], ['Language', detail.language], ['Country', detail.country], ['Awards', detail.awards]].filter(([, value]) => value && value !== '—');
  return <dialog ref={dialog} className="modal film-dialog" aria-labelledby="film-title" onClick={e => { if (e.target === e.currentTarget) { const bounds = e.currentTarget.getBoundingClientRect(); if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) onClose(); } }}>
    <p className="sr-only" role="status" aria-live="polite">{message}</p>
    <button autoFocus className="modal-close" onClick={onClose} aria-label="Close film details">✕</button>
    <div className="modal-poster-col">{detail.poster && !imgError ? <img src={detail.poster} alt={`${detail.title} poster`} className="modal-poster-img" width="300" height="450" decoding="async" onError={() => setImgError(true)} /> : <div className="modal-poster-fallback">{detail.title}</div>}<p className="poster-credit">Film data & posters via OMDb.</p></div>
    <div className="modal-info-col">
      <div className="modal-badges">{detail.genre && <span className="modal-badge badge-genre">{detail.genre}</span>}{detail.rated && <span className="modal-badge badge-genre">{detail.rated}</span>}</div>
      <h2 id="film-title" className="modal-title">{detail.title}</h2>
      <div className="modal-meta"><span>{detail.year}</span>{detail.runtime && detail.runtime !== '—' && <span>{detail.runtime}</span>}</div>
      <div className="film-actions"><button className={`modal-watchlist-btn${saved ? ' saved' : ''}`} aria-pressed={saved} onClick={() => toggle(detail)}>{saved ? '✓ Saved · remove' : '+ Add to watchlist'}</button><a className="modal-trailer-btn" href={trailerUrl(detail.title, detail.year)} target="_blank" rel="noopener noreferrer">Find trailer ↗<span className="sr-only"> on YouTube, opens a new tab</span></a></div>
      {status && <div className="detail-status"><p role="status">{status}</p>{!status.startsWith('Loading') && <button className="sort-btn" onClick={() => setAttempt(i => i + 1)}>Retry details</button>}</div>}
      <p className="modal-plot">{detail.desc || 'Loading synopsis…'}</p>
      <dl className="modal-details">{rows.map(([label, value]) => <div className="modal-detail-item" key={label}><dt className="modal-detail-label">{label}</dt><dd className="modal-detail-value">{value}</dd></div>)}</dl>
      {(detail.ratings || []).length > 0 && <div className="modal-ratings" aria-label="Published film ratings">{detail.ratings.map(r => <div className="modal-rating-pill" key={r.Source}><div className="modal-rating-source">{r.Source.replace('Internet Movie Database', 'IMDb')}</div><div className="modal-rating-value">{r.Value}</div></div>)}</div>}
      <p className="data-source-note">Ratings reflect the data returned by OMDb and can change. Trailer links open a YouTube search.</p>
    </div>
  </dialog>;
}
