import { useEffect } from 'react';
import { useWatchlist } from '../context/WatchlistContext';

export default function WatchlistPanel({ open, onClose, onOpenModal }) {
  const { watchlist, remove } = useWatchlist();

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <>
      <div className={`watchlist-backdrop${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`watchlist-panel${open ? ' open' : ''}`}>
        <div className="watchlist-header">
          <h3>My Watchlist</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="watchlist-body">
          {watchlist.length === 0 ? (
            <div className="watchlist-empty">
              Your watchlist is empty.<br />Click ★ on any film to save it.
            </div>
          ) : (
            watchlist.map(m => (
              <div
                key={m.imdbID}
                className="watchlist-item"
                onClick={() => onOpenModal(m)}
              >
                {m.poster && (
                  <img
                    src={m.poster}
                    alt={m.title}
                    className="watchlist-item-thumb"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="watchlist-item-info">
                  <div className="watchlist-item-title">{m.title}</div>
                  <div className="watchlist-item-year">{m.year}</div>
                </div>
                <button
                  className="watchlist-item-remove"
                  onClick={e => { e.stopPropagation(); remove(m.imdbID); }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
