import { Link } from 'react-router-dom';
import { useOMDb } from '../context/OMDbContext';

export default function Footer() {
  const { loadGenre } = useOMDb();

  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="logo"><span>Cine</span>Vault</Link>
          <p>A passion project dedicated to celebrating the art of cinema — from the silent era to today's streaming age. Every frame tells a story.</p>
        </div>
        <div className="footer-col">
          <h4>Browse</h4>
          <ul>
            {['Top20','Drama','Thriller','Sci-Fi','Crime'].map(g => (
              <li key={g}>
                <Link to="/" onClick={() => loadGenre(g)}>
                  {g === 'Top20' ? 'Top 20' : g}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>About</h4>
          <ul>
            <li><Link to="/about">About CineVault</Link></li>
            <li><Link to="/about#story">Our Story</Link></li>
            <li><Link to="/about#how">How It Works</Link></li>
            <li><Link to="/about#timeline">Cinema Timeline</Link></li>
            <li><Link to="/about#contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 CineVault — All rights reserved</p>
        <span className="footer-tagline">
          "Cinema is a mirror by which we often see ourselves." — Martin Scorsese
        </span>
      </div>
    </footer>
  );
}
