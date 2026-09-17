
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { OMDbProvider } from './context/OMDbContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MovieModal from './components/MovieModal';
import WatchlistPanel from './components/WatchlistPanel';
function RouteEffects() {
  const { pathname, hash } = useLocation();
  const previous = useRef(pathname);
  useEffect(() => {
    document.title = pathname === '/about' ? 'CineVault — Project Notes' : 'CineVault — Film Discovery & Watchlist';
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
      else if (previous.current !== pathname) { window.scrollTo(0, 0); document.getElementById('main-content')?.focus({ preventScroll: true }); }
      previous.current = pathname;
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}
function Experience() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const openFromWatchlist = movie => {
    setWatchlistOpen(false);
    // Restore focus to a persistent trigger before mounting the next dialog.
    requestAnimationFrame(() => { document.querySelector('.watchlist-btn')?.focus(); setSelectedMovie(movie); });
  };
  return <>
    <RouteEffects />
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <Navbar onWatchlistOpen={() => setWatchlistOpen(true)} />
    <div className="project-banner"><span>Independent portfolio project · developed from a course final</span><Link to="/about">Behind the product ↗</Link></div>
    <Routes><Route path="/" element={<HomePage onOpenModal={setSelectedMovie} />} /><Route path="/about" element={<AboutPage />} /><Route path="*" element={<main id="main-content" tabIndex={-1} className="not-found"><h1>This scene is missing.</h1><Link to="/">Return to film discovery</Link></main>} /></Routes>
    {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    {watchlistOpen && <WatchlistPanel onClose={() => setWatchlistOpen(false)} onOpenModal={openFromWatchlist} />}
  </>;
}
export default function App() {
  return <BrowserRouter><ThemeProvider><WatchlistProvider><OMDbProvider><Experience /></OMDbProvider></WatchlistProvider></ThemeProvider></BrowserRouter>;
}
