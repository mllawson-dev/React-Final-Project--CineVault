
import { useWatchlist } from '../context/WatchlistContext';
import useDialog from './useDialog';
export default function WatchlistPanel({ onClose, onOpenModal }) {
  const { watchlist, remove, storageAvailable, message } = useWatchlist();
  const dialog = useDialog(onClose);
  return <dialog ref={dialog} className="watchlist-panel open" aria-labelledby="watchlist-title" onClick={e => { if (e.target === e.currentTarget) { const b=e.currentTarget.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) onClose(); } }}>
    <p className="sr-only" role="status" aria-live="polite">{message}</p>
    <div className="watchlist-header"><h2 id="watchlist-title">Your next watches</h2><button autoFocus onClick={onClose} aria-label="Close watchlist">✕</button></div>
    <p className="watchlist-note">{storageAvailable ? 'Saved in this browser. No account needed.' : 'Browser storage is unavailable. Saves will last for this session.'}</p>
    <div className="watchlist-body">
      {!watchlist.length ? <div className="watchlist-empty"><span className="empty-star" aria-hidden="true">☆</span><h3>A good film can wait.</h3><p>Save a title with ★ and build a collection for your next evening.</p><button className="btn-hero-primary" onClick={onClose}>Discover films</button></div> : watchlist.map(movie => <div className="watchlist-item" key={movie.imdbID}><button className="watchlist-film-trigger" onClick={() => onOpenModal(movie)} aria-label={`View details for ${movie.title}`}>{movie.poster && <img src={movie.poster} alt="" className="watchlist-item-thumb" width="46" height="64" loading="lazy" onError={e => { e.currentTarget.style.visibility = 'hidden'; }} />}<span className="watchlist-item-info"><span className="watchlist-item-title">{movie.title}</span><span className="watchlist-item-year">{movie.year}</span></span></button><button className="watchlist-item-remove" onClick={() => remove(movie.imdbID)} aria-label={`Remove ${movie.title} from watchlist`}>✕</button></div>)}
    </div>
  </dialog>;
}
