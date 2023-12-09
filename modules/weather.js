const axios = require("axios");

class Forecast {
    constructor(weatherData){
        this.date = weatherData.datetime;
        this.description = weatherData.weather.description;
    }
}

async function getWeatherData(lat, lon, WEATHER_API_KEY) {
    try {
        const weatherResponse = await axios.get('https://api.weatherbit.io/v2.0/forecast/daily', {
            params: {
                lat: lat,
                lon: lon,
                key: WEATHER_API_KEY
            }
        });

        const dailyWeather = weatherResponse.data.data.map(day => {
            return new Forecast(day);
        });

        return dailyWeather;
    } catch (error) {
        throw new Error("Error fetching weather data");
    }
}

module.exports = {
    getWeatherData,
};
