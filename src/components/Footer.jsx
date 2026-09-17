
import { Link } from 'react-router-dom';
import { useOMDb } from '../context/OMDbContext';
export default function Footer() {
  const { loadGenre } = useOMDb();
  return <footer><div className="footer-main"><div className="footer-brand"><Link to="/" className="logo"><span>Cine</span>Vault</Link><p>Find a film worth your evening.<br />Keep the next one close.</p></div><div className="footer-col"><h2>Explore</h2><ul>{['Top20', 'Drama', 'Crime', 'Thriller', 'Sci-Fi'].map(genre => <li key={genre}><Link to="/" onClick={() => loadGenre(genre)}>{genre === 'Top20' ? 'Curated 20' : genre}</Link></li>)}</ul></div><div className="footer-col"><h2>The project</h2><ul><li><Link to="/about">Product overview</Link></li><li><Link to="/about#decisions">Design decisions</Link></li><li><Link to="/about#engineering">Engineering approach</Link></li><li><Link to="/about#scope">Scope & limitations</Link></li></ul></div></div><div className="footer-bottom"><p>CineVault · Independent portfolio project</p><p>Movie data & posters: <a href="https://www.omdbapi.com/" target="_blank" rel="noopener noreferrer">OMDb ↗</a> · No IMDb affiliation</p></div></footer>;
}
