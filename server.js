'use strict';

let weather = require('./data/weather.json');

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use( cors() );

const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
    let data = { message: "Goodbye World"};
    response.json(data);
});

app.get("*", (request, response) => {
    response.status(404).send("Page Not Avaiable");
});

app.get('/weather', (request, response)=>{
    response.json(data);
})

app.use( (error, request, response, next) => {
    response.status(500).send(error.message);
  });

  app.listen( 
    PORT, 
    () => console.log(`Listening on port ${PORT}`)
);