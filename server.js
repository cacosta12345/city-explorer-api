'use strict';

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { getWeatherData } = require('./modules/weather');
const { getMovieData } = require('./modules/movies');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_ACCESS_TOKEN = process.env.MOVIE_ACCESS_TOKEN;

app.get('/', (request, response) => {
    let data = { message: "Hello World" };
    response.json(data);
});

app.get('/weather', async (request, response) => {
    const { lat, lon } = request.query;
    try {
        const weatherData = await getWeatherData(lat, lon, WEATHER_API_KEY);
        response.json(weatherData);
    } catch (error) {
        response.status(500).send(error.message);
    }
});

app.get('/movies', async (request, response) => {
    const movieQuery = request.query.city;
    try {
        const movieData = await getMovieData(movieQuery, MOVIE_ACCESS_TOKEN);
        response.json(movieData);
    } catch (error) {
        response.status(500).send(error.message);
    }
});

app.use((error, request, response, next) => {
    response.status(500).send(error.message);
});

app.listen(
    PORT,
    () => console.log(`Listening on port ${PORT}`)
);