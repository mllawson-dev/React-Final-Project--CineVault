import { useState, useEffect, useCallback } from 'react';
import { useWatchlist } from '../context/WatchlistContext';

const HERO_COUNT = 5;

export default function HeroSpotlight({ movies, onOpenModal }) {
  const [idx, setIdx]   = useState(0);
  const { toggle, isSaved } = useWatchlist();

  const next = useCallback(
    () => setIdx(i => (i + 1) % Math.min(HERO_COUNT, movies.length)),
    [movies.length]
  );

  useEffect(() => {
    if (!movies.length) return;
    setIdx(0);
  }, [movies]);

  useEffect(() => {
    if (!movies.length) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [movies.length, next]);

  if (!movies.length) return <div className="hero hero-empty" />;

  const film   = movies[idx];
  const saved  = isSaved(film.imdbID);
  const count  = Math.min(HERO_COUNT, movies.length);

  return (
    <section className="hero">
      <div
        className="hero-backdrop"
        style={film.poster ? { backgroundImage: `url('${film.poster}')` } : {}}
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-eyebrow">▶ Featured Film</p>
        <h1 className="hero-title">{film.title}</h1>
        <p className="hero-sub">{film.desc}</p>
        <div className="hero-actions">
          <button className="btn-hero-primary" onClick={() => onOpenModal(film)}>
            View Details
          </button>
          <button
            className={`btn-hero-ghost${saved ? ' in-watchlist' : ''}`}
            onClick={() => toggle(film)}
          >
            {saved ? '✓ In Watchlist' : '+ Watchlist'}
          </button>
        </div>
        <div className="hero-dots">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === idx ? ' active' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`Go to film ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
