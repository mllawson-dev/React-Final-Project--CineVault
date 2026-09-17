
import { useState, useEffect } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
const HERO_COUNT = 5;
export default function HeroSpotlight({ movies, onOpenModal }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { toggle, isSaved } = useWatchlist();
  const count = Math.min(HERO_COUNT, movies.length);
  useEffect(() => { setIdx(0); setPlaying(false); }, [movies]);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => { setReducedMotion(preference.matches); if (preference.matches || document.hidden) setPlaying(false); };
    preference.addEventListener('change', stop);
    document.addEventListener('visibilitychange', stop);
    stop();
    return () => { preference.removeEventListener('change', stop); document.removeEventListener('visibilitychange', stop); };
  }, []);
  useEffect(() => {
    if (!playing || interacting || count < 2) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % count), 7000);
    return () => clearInterval(timer);
  }, [playing, interacting, count]);
  const film = movies[idx] || movies[0];
  if (!film) return <section className="hero hero-empty"><div className="hero-content"><p className="hero-eyebrow">A personal cinema companion</p><h1 className="hero-title">Find your<br /><em>next great film.</em></h1><p className="hero-sub">Explore considered collections. Follow your curiosity. Keep a watchlist for another evening.</p><a href="#discovery" className="btn-hero-primary">Explore films ↓</a></div></section>;
  const saved = isSaved(film.imdbID);
  return <section className="hero" aria-label="Featured films" aria-roledescription="carousel" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false); }}>
    <div className="hero-backdrop" style={film.poster ? { backgroundImage: `url('${film.poster}')` } : {}} />
    <div className="hero-overlay" />
    <div className="hero-content">
      <p className="hero-eyebrow">The CineVault selection · {idx + 1} / {count}</p>
      <h1 className="hero-title">{film.title}</h1>
      <p className="hero-film-meta">{film.year} <span>·</span> {film.runtime} <span>·</span> ★ {film.rating} IMDb</p>
      <p className="hero-sub">{film.desc}</p>
      <div className="hero-actions"><button className="btn-hero-primary" onClick={() => { setPlaying(false); onOpenModal(film); }}>View details</button><button className={`btn-hero-ghost${saved ? ' in-watchlist' : ''}`} aria-pressed={saved} onClick={() => toggle(film)}>{saved ? '✓ Saved' : '+ Watchlist'}</button></div>
      <div className="hero-carousel-controls">
        <div className="hero-dots">{movies.slice(0, HERO_COUNT).map((movie, i) => <button key={movie.imdbID} className={`hero-dot${i === idx ? ' active' : ''}`} onClick={() => { setIdx(i); setPlaying(false); }} aria-label={`Feature ${movie.title}`} aria-pressed={i === idx}><span /></button>)}</div>
        {count > 1 && <button className="carousel-play" disabled={reducedMotion} title={reducedMotion ? 'Automatic playback is disabled by your reduced-motion preference.' : undefined} onClick={() => setPlaying(value => !value)} aria-pressed={playing}>{reducedMotion ? 'Reduced motion · manual selection' : playing ? 'Ⅱ Pause slideshow' : '▶ Play slideshow'}</button>}
      </div>
    </div>
  </section>;
}
