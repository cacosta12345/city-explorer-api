const axios = require('axios');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const weatherCache = require('./cache'); 

class WeatherFetcher {
  static async fetchWeatherData(lat, lon, searchQuery) {
    try {
      let apiWeatherUrl;
      const cacheKey = lat && lon ? `${lat}-${lon}` : searchQuery;

      if (weatherCache[cacheKey] && Date.now() - weatherCache[cacheKey].timestamp < 60000) {
        console.log('Cache hit for:', cacheKey);
        return weatherCache[cacheKey].data; 
      }

      if (lat && lon) {
        apiWeatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`;
      } else {
        apiWeatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuery}&key=${WEATHER_API_KEY}`;
      }

      const weatherResponse = await axios.get(apiWeatherUrl);

      if (weatherResponse && weatherResponse.data && weatherResponse.data.data) {
        const forecasts = weatherResponse.data.data.map(day => ({
          description: `Low of ${(day.low_temp * 9) / 5 + 32}°F, high of ${(day.high_temp * 9) / 5 + 32}°F with ${day.weather.description}`,
          date: day.datetime,
          dayOfWeek: new Date(day.datetime).toLocaleString('en-us', { weekday: 'long' }),
        }));

        weatherCache[cacheKey] = {
          timestamp: Date.now(),
          data: forecasts,
        };

        return forecasts;
      } else {
        throw new Error('Weather data not found');
      }
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  }
}

module.exports = WeatherFetcher;
