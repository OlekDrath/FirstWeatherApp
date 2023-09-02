// Import necessary modules

import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

// Constants (API KEY is necessary to gather information from the Public Weather API Server )

const app = express();
const port = 3000;
const API_KEY = "75f5ef851d5beaca17b5de5e20e1c39b"
const API_URL = "https://api.openweathermap.org"

// Using necessary modules

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// Render main page based on index.ejs file

app.get("/", async (req, res) => {

    res.render("index.ejs")

});


// Getting the location name that user has inserted in search bar

app.post("/", async (req, res) => {
    const cityName = req.body.location

    // If the location name is valid sending it to the Public Weather API Server

    try {
        const coordinates = await axios.get(API_URL + "/geo/1.0/direct?q=" + cityName
            + "&limit=1" + "&appid=" + API_KEY);

        // Getting the coordinates of the location 

        const lat = coordinates.data[0].lat;
        const lon = coordinates.data[0].lon;

        // Sending the coordinates to the Public Weather API Server to get infomration about weather in that location

        const locationWeather = await axios.get(API_URL + "/data/2.5/weather?lat=" + lat + "&lon="
            + lon + "&units=metric&appid=" + API_KEY);

        // Sending this weather information to the index.ejs file to be displayed on the web page

        res.render("index.ejs", {
            weatherMain: locationWeather.data.weather[0].main,
            weatherDescription: locationWeather.data.weather[0].description,
            weatherIcon: locationWeather.data.weather[0].icon,
            weatherTemp: locationWeather.data.main.temp,
            weatherWind: locationWeather.data.wind.speed
        });

        // If user has enetered the wrong location name this will pop up instead

    } catch (error) {
        res.render("index.ejs", { error: error.response.data });
        console.log(error.response.data)
    }
});

// Information confirming the operation of the server

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});