import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import { API_KEY, BASE_URL, IMAGE_URL } from '../config';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { showToast } = useToast();


  useEffect(() => {
    fetchTrending(1, true);
    fetchGenres();
  }, []);

  const fetchTrending = async (pageNum = 1, isInitial = false) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${pageNum}`);
      let results = data.results || [];

      // If initial fetch has few items but more pages exist, fetch page 2 automatically
      if (isInitial && results.length < 10 && data.total_pages > 1) {
        try {
          const p2 = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=2`);
          results = [...results, ...(p2.data.results || [])];
          pageNum = 2;
        } catch (e) {
          console.error(e);
        }
      }

      if (isInitial) {
        setMovies(results);
        if (results.length > 0) {
          setFeaturedMovie(results[0]);
        }
      } else {
        setMovies((prev) => [...prev, ...results]);
      }

      setHasMore(pageNum < data.total_pages && results.length >= 12);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching trending movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
      setGenres(data.genres || []);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setSelectedGenre(null);
    setActiveSearch(search);
    try {
      const { data } = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(search)}&page=1`);
      let results = data.results || [];
      let currentPage = 1;

      // If search results on page 1 are fewer than 10, try fetching page 2 to provide a fuller list
      if (results.length > 0 && results.length < 10 && data.total_pages > 1) {
        try {
          const p2 = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(search)}&page=2`);
          results = [...results, ...(p2.data.results || [])];
          currentPage = 2;
        } catch (e) {
          console.error(e);
        }
      }

      setMovies(results);
      setPage(currentPage);
      setHasMore(currentPage < data.total_pages && results.length >= 12);
      showToast(`Showing results for "${search}"`, 'info');
    } catch (err) {
      console.error('Error searching movies:', err);
      showToast('Failed to search movies. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    setActiveSearch('');
    setSelectedGenre(null);
    setPage(1);
    fetchTrending(1, true);
    showToast('Filters reset to Trending movies', 'info');
  };

  const filterByGenre = async (genreId) => {
    if (selectedGenre === genreId) {
      clearSearch();
      return;
    }
    setLoading(true);
    setSearch('');
    setActiveSearch('');
    setSelectedGenre(genreId);
    try {
      const { data } = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=1`);
      let results = data.results || [];
      let currentPage = 1;

      if (results.length > 0 && results.length < 10 && data.total_pages > 1) {
        try {
          const p2 = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=2`);
          results = [...results, ...(p2.data.results || [])];
          currentPage = 2;
        } catch (e) {
          console.error(e);
        }
      }

      setMovies(results);
      setPage(currentPage);
      setHasMore(currentPage < data.total_pages && results.length >= 12);
      const genreName = genres.find((g) => g.id === genreId)?.name;
      if (genreName) {
        showToast(`Filtered by genre: ${genreName}`, 'info');
      }
    } catch (err) {
      console.error('Error filtering by genre:', err);
      showToast('Failed to filter by genre.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      let endpoint = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${nextPage}`;
      if (activeSearch) {
        endpoint = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(activeSearch)}&page=${nextPage}`;
      } else if (selectedGenre) {
        endpoint = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&page=${nextPage}`;
      }
      const { data } = await axios.get(endpoint);
      const newResults = data.results || [];
      setMovies((prev) => [...prev, ...newResults]);
      setPage(nextPage);
      setHasMore(nextPage < data.total_pages && newResults.length >= 10);
    } catch (err) {
      console.error('Error loading more movies:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Featured Hero Banner (Only on default Home view) */}
      {!activeSearch && !selectedGenre && featuredMovie && (
        <div className="relative w-full h-[450px] md:h-[520px] overflow-hidden bg-gray-900 mb-8">
          {featuredMovie.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
              alt={featuredMovie.title}
              className="w-full h-full object-cover opacity-40 filter brightness-90"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent flex flex-col justify-end p-6 md:p-12 max-w-4xl">
            <span className="inline-block w-fit text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-full mb-3">
              ★ Trending #1 Movie
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">
              {featuredMovie.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6 max-w-2xl">
              {featuredMovie.overview}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={`/movie/${featuredMovie.id}`}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-400 hover:to-amber-400 transition transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <span>▶ Watch Details</span>
              </Link>
              <button
                onClick={() => toggleWatchlist(featuredMovie)}
                className={`px-6 py-3 rounded-xl font-semibold transition border ${
                  isInWatchlist(featuredMovie.id)
                    ? 'bg-red-600/30 text-red-300 border-red-500/50 hover:bg-red-600 hover:text-white'
                    : 'bg-gray-800/80 backdrop-blur-md text-gray-200 border-gray-700 hover:bg-gray-700'
                }`}
              >
                {isInWatchlist(featuredMovie.id) ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative mb-6 flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search movies by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 focus:border-orange-500 text-gray-100 placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm px-2 py-1"
              >
                ✕ Clear
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-400 hover:to-amber-400 transition shadow-md"
          >
            Search
          </button>
        </form>

        {/* Genre Selector Pills */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              {activeSearch ? `Search Results for "${activeSearch}"` : 'Filter by Genre'}
            </h3>
            {(activeSearch || selectedGenre) && (
              <button
                onClick={clearSearch}
                className="text-xs text-orange-400 hover:underline font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={clearSearch}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                !selectedGenre && !activeSearch
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              All Movies
            </button>
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => filterByGenre(g.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedGenre === g.id
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Movie Results */}
        {movies.length > 0 ? (
          <>
            <MovieList movies={movies} isWatchlist={false} />

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-10 mb-12">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-orange-400 hover:text-orange-300 font-bold rounded-xl transition shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More Movies'}
                </button>
              </div>
            )}
          </>
        ) : !loading ? (
          <div className="text-center py-16 bg-gray-900/40 rounded-2xl border border-gray-800">
            <span className="text-5xl block mb-3">🔍</span>
            <h3 className="text-lg font-bold text-gray-300">No movies found</h3>
            <p className="text-gray-500 text-sm mt-1">Try searching for a different keyword or genre.</p>
            <button
              onClick={clearSearch}
              className="mt-4 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-400"
            >
              Back to Trending
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;

