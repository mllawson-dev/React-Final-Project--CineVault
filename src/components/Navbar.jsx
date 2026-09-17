
import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useOMDb } from '../context/OMDbContext';
const GENRES = ['Top20', 'Drama', 'Crime', 'Thriller', 'Sci-Fi'];
export default function Navbar({ onWatchlistOpen }) {
  const { theme, toggleTheme } = useTheme();
  const { watchlist } = useWatchlist();
  const { activeGenre, loadGenre, isSearch } = useOMDb();
  const isHome = useLocation().pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const trigger = useRef(null);
  const closeMenu = () => setMenuOpen(false);
  return <nav className="navbar" aria-label="Main navigation" onKeyDown={e => {
    if (e.key === 'Escape' && menuOpen) { closeMenu(); trigger.current?.focus(); }
  }}>
    <Link to="/" className="logo" onClick={closeMenu}><span>Cine</span>Vault</Link>
    <button ref={trigger} className="nav-icon-btn menu-toggle" aria-expanded={menuOpen} aria-controls="site-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(value => !value)}>{menuOpen ? '✕' : '☰'}</button>
    <div id="site-menu" className={`nav-center${menuOpen ? ' menu-open' : ''}`}>
      {isHome ? GENRES.map(genre => <button key={genre} className={`genre-tab${activeGenre === genre && !isSearch ? ' active' : ''}`} aria-pressed={activeGenre === genre && !isSearch} onClick={() => { loadGenre(genre); closeMenu(); trigger.current?.focus(); }}>{genre === 'Top20' ? 'Curated 20' : genre}</button>) : <Link className="genre-tab" to="/" onClick={closeMenu}>← Discover films</Link>}
      <Link className={`nav-about${!isHome ? ' active' : ''}`} to="/about" aria-current={!isHome ? 'page' : undefined} onClick={closeMenu}>Project notes</Link>
    </div>
    <div className="nav-right">
      <button className="nav-icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title="Toggle theme">{theme === 'dark' ? '☾' : '☀'}</button>
      <button className="nav-icon-btn watchlist-btn" onClick={() => { closeMenu(); onWatchlistOpen(); }} aria-label={`Open watchlist, ${watchlist.length} saved films`}>★ {watchlist.length}</button>
    </div>
  </nav>;
}
