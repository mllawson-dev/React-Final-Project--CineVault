import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider }    from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { OMDbProvider }     from './context/OMDbContext';
import Navbar               from './components/Navbar';
import HomePage             from './pages/HomePage';
import AboutPage            from './pages/AboutPage';
import MovieModal           from './components/MovieModal';
import WatchlistPanel       from './components/WatchlistPanel';
import { fetchDetail }      from './services/omdb';

// App-level modal + watchlist state lives here so Navbar can trigger them
export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  const openModal = async (movie) => {
    if (!movie.desc || movie.desc === 'No description available.') {
      const full = await fetchDetail(movie.imdbID, true);
      setSelectedMovie(full || movie);
    } else {
      setSelectedMovie(movie);
    }
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        <WatchlistProvider>
          <OMDbProvider>
            <Navbar onWatchlistOpen={() => setWatchlistOpen(true)} />

            <Routes>
              <Route path="/"       element={<HomePage onOpenModal={openModal} onWatchlistOpen={() => setWatchlistOpen(true)} />} />
              <Route path="/about"  element={<AboutPage />} />
            </Routes>

            {/* Global modal — accessible from watchlist or hero on any page */}
            {selectedMovie && (
              <MovieModal
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
              />
            )}

            <WatchlistPanel
              open={watchlistOpen}
              onClose={() => setWatchlistOpen(false)}
              onOpenModal={openModal}
            />
          </OMDbProvider>
        </WatchlistProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
