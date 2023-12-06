'use strict';


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios")

const app = express();

app.use( cors() );

const PORT = process.env.PORT || 3000;

// class Forecast {
//     constructor(weatherData){
//         this.date= weatherData.data.valid_date;
//         this.description = weatherData.data.weather.description;
//     }
// }

app.get('/', (request, response) => {
    let data = { message: "Hello World"};
    response.json(data);
});

app.get('/weather', getWeatherData);

async function getWeatherData(request,response){
    let lat = request.query.lat
    let lon = request.query.lon
    
    let axiosResponse = await axios.get('https://api.weatherbit.io/v2.0/forecast/daily?',
    {
        params: {
            lat: lat,
            lon: lon,
            key: process.env.WEATHER_API_KEY
        }
    });
    
    response.json(axiosResponse);
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