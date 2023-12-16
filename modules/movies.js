const axios = require("axios");
const MOVIE_API_KEY = process.env.MOVIE_API_KEY
const movieCache = require('./cache')

class MovieFetcher {
    static async fetchMoviesByCity(city) {
      try {
        const cacheKey = `movies-${city}`;
  
        
        if (movieCache[cacheKey] && Date.now() - movieCache[cacheKey].timestamp < 60000) {
          console.log('Cache hit for movies in:', city);
          return movieCache[cacheKey].data;
        }
  
        const movieURL = "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1";
  
        if (!city) {
          throw new Error('Please provide a valid city');
        }
  
        const movieResponse = await axios.get(movieURL, {
          params: { query: `${city}` },
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${MOVIE_API_KEY}`,
          },
        });
  
        if (movieResponse && movieResponse.data && movieResponse.data.results) {
          const movies = movieResponse.data.results.slice(0, 20).map(movie => ({
            title: movie.title,
            overview: movie.overview,
            average_votes: movie.vote_average,
            total_votes: movie.vote_count,
            image_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            popularity: movie.popularity,
            released_on: movie.release_date,
          }));
  
          
          movieCache[cacheKey] = {
            timestamp: Date.now(),
            data: movies,
          };
  
          return movies;
        } else {
          throw new Error(`No movies found for '${city}'`);
        }
      } catch (error) {
        throw new Error('Failed to fetch movie data');
      }
    }
  }
  
  module.exports = MovieFetcher;