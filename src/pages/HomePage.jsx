import { useState, useMemo, useEffect } from 'react';
import { useOMDb }    from '../context/OMDbContext';
import HeroSpotlight  from '../components/HeroSpotlight';
import SearchBar      from '../components/SearchBar';
import SortBar        from '../components/SortBar';
import MovieGrid      from '../components/MovieGrid';
import Footer         from '../components/Footer';

function sortMovies(movies, method) {
  const list = [...movies];
  switch (method) {
    case 'az':     return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'za':     return list.sort((a, b) => b.title.localeCompare(a.title));
    case 'newest': return list.sort((a, b) => b.year - a.year);
    case 'oldest': return list.sort((a, b) => a.year - b.year);
    case 'rating': return list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    default:       return list;
  }
}

export default function HomePage({ onOpenModal }) {
  const { movies, loading, error, loadGenre, isSearch } = useOMDb();
  const [sort, setSort] = useState('az');

  // Load Top 20 on first mount
  useEffect(() => { loadGenre('Top20'); }, []); // eslint-disable-line

  const sorted = useMemo(() => sortMovies(movies, sort), [movies, sort]);

  return (
    <>
      <HeroSpotlight movies={sorted} onOpenModal={onOpenModal} />
      <SearchBar />
      <SortBar sort={sort} onSort={setSort} count={sorted.length} />
      <main>
        <MovieGrid
          movies={sorted}
          loading={loading}
          error={error}
          onOpenModal={onOpenModal}
          isSearch={isSearch}
        />
      </main>
      <Footer />
    </>
  );
}
