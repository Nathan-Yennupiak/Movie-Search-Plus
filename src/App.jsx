import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  header: {
    accept: 'application/json',
    authorization: `Bearer ${API_KEY}`

  }
}
const App = () => {

  // State for search term, error message and movies
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');

  // Debounce search term to prevent API call on every key stroke 
  // and only call API after user stops typing for 1.5 seconds
  useDebounce(() => {
    setDebounceSearchTerm(searchTerm);
  }, 1500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    // Set loading to true
    setIsLoading(true);
    // Reset error message
    setErrorMessage('');

    try {
      // Set endpoint based on query or default to popular movies
      const endpoint = query ?  `${API_BASE_URL}/search/movie?query=${encodeURI(query)}&api_key=${API_KEY}`
      :  `${API_BASE_URL}/discover/movie?sortby=popularity.desc&api_key=${API_KEY}`;

      // Fetch data
      const response = await fetch(endpoint, API_OPTIONS);

      // Check if response is ok
      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      // Parse response
      const data = await response.json();

      // Check if response is successful
      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        // Set movie list to empty array
      setMovieList([]);
      return;
      }

      // Set movie list to data.results
      setMovieList(data.results || []);

      if(query && data.results.length>0) {
        // Update search count in Appwrite
        await updateSearchCount(query, data.results[0]);
        
      }
      
    } catch(error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }

    // Finally set loading to false after fetching movies
    finally {
      setIsLoading(false);
    }
  }

  // Fetch trending movies
  const loadTrendingMovies = async () => {
    try {
        const movies = await getTrendingMovies();
        setTrendingMovies(movies);
    } catch(error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(()=> {
    fetchMovies(debounceSearchTerm);
  },[debounceSearchTerm]);

  // Load trending movies on initial render
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="./hero1.png" alt="Hero banner" />
          <h1>Find 
            <span className="text-gradient">Movies</span>
            You will Enjoy without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {/* Display trending movies */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
             
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

  {/* Display spinner if loading, error message if there is an error, or movie list if there are movies */}
  {isLoading ? (
    <div className="flex justify-center items-center h-2">
      <Spinner />
    </div>
  ) : errorMessage ? (
    <p className="text-red-500">{errorMessage}</p>
  ) : (
    <ul>
      {movieList.map((movie) => (
       <MovieCard key={movie.id} movie={movie} />

      ))}
    </ul>
  )}

  {errorMessage && <p className="text-red-500">{errorMessage}</p>}
</section>

      </div>
      
    </main>
  );
};

export default App;
