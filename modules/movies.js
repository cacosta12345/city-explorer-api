const axios = require("axios");

class Movie {
    constructor(movie){
        this.title = movie.title;
        this.releaseDate = movie.release_date;
        this.image = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
        this.overview = movie.overview;
    }
}

async function getMovieData(movieQuery, MOVIE_ACCESS_TOKEN) {
    try {
        const axiosResponse = await axios.get('https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1', {
            params: {
                query: movieQuery,
            },
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${MOVIE_ACCESS_TOKEN}`
            }
        });

        const choiceMovie = axiosResponse.data.results.map(movie => {
            return new Movie(movie);
        });

        return choiceMovie;
    } catch (error) {
        throw new Error("Error fetching movie data");
    }
}

module.exports = {
    getMovieData,
};