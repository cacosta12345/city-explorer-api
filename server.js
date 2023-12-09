'use strict';


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios")
const weather = require('./modules/weather.js')

const app = express();

app.use( cors() );

const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_ACCESS_TOKEN = process.env.MOVIE_ACCESS_TOKEN;

class Forecast {
    constructor(weatherData){
        this.date= weatherData.datetime;
        this.description = weatherData.weather.description;
    }
}

class Movie {
    constructor(movie){
        this.title= movie.title;
        this.releaseDate = movie.release_date;
        this.image = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
        this.overview = movie.overview
    }
}

app.get('/', (request, response) => {
    let data = { message: "Hello World"};
    response.json(data);
});

app.get('/weather', weatherHandler);

app.get('/movies', getMovieData);

async function getMovieData(request,response){
    let movieQuery = request.query.city

    let axiosResponse = await axios.get('https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1',
    {
        params: {
            query: movieQuery,
        },
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${MOVIE_ACCESS_TOKEN}`
        }
    });

    let choiceMovie = axiosResponse.data.results.map((movie)=>{
        return new Movie(movie);
    })

    console.log(choiceMovie);
    response.json(choiceMovie);
}

function weatherHandler(request,response){
    const {lat,lon}= request.query;
    
   weather(lat,lon)
   .then(summaries => response.send(summaries))
   .catch((error)=>{
    console.error(error);
    response.status(500).send('Sorry. Something went wrong. Please try again')
   })
}

app.get('/')

app.get("*", (request, response) => {
    response.status(404).send("Page Not Avaiable");
});


app.use( (error, request, response, next) => {
    response.status(500).send(error.message);
  });

  app.listen( 
    PORT, 
    () => console.log(`Listening on port ${PORT}`)
);