'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WeatherFetcher = require('./modules/weather'); 
const MovieFetcher = require('./modules/movies'); 

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.get('/weather', async (req, res) => {
  const { lat, lon, searchQuery } = req.query;

  if ((lat && lon) || searchQuery) {
    try {
      const forecasts = await WeatherFetcher.fetchWeatherData(lat, lon, searchQuery);
      res.json(forecasts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: 'Invalid request. Please provide valid latitude and longitude or a search query.' });
  }
});

app.get('/movies', async (req, res) => {
  try {
    const city = req.query.city;
    const movies = await MovieFetcher.fetchMoviesByCity(city);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;