import { Link, useLocation } from 'react-router-dom';
import { useTheme }     from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useOMDb }      from '../context/OMDbContext';

const GENRES = ['Top20', 'Drama', 'Crime', 'Thriller', 'Sci-Fi'];

export default function Navbar({ onWatchlistOpen }) {
  const { theme, toggleTheme }   = useTheme();
  const { watchlist }            = useWatchlist();
  const { activeGenre, loadGenre, isSearch } = useOMDb();
  const location = useLocation();
  const isHome   = location.pathname === '/';

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span>Cine</span>Vault
      </Link>

      {isHome && (
        <div className="nav-center">
          {GENRES.map(g => (
            <button
              key={g}
              className={`genre-tab ${activeGenre === g && !isSearch ? 'active' : ''}`}
              onClick={() => loadGenre(g)}
            >
              {g === 'Top20' ? 'Top 20' : g}
            </button>
          ))}
          <Link
            to="/about"
            className="nav-about"
          >
            About
          </Link>
        </div>
      )}

      {!isHome && (
        <div className="nav-center">
          <Link to="/" className="genre-tab">← Home</Link>
          <Link to="/about" className="nav-about active">About</Link>
        </div>
      )}

      <div className="nav-right">
        <button className="nav-icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☾' : '☀'}
        </button>
        {isHome && (
          <button
            className="nav-icon-btn watchlist-btn"
            onClick={onWatchlistOpen}
            title="My Watchlist"
          >
            ★ {watchlist.length}
          </button>
        )}
      </div>
    </nav>
  );
}
