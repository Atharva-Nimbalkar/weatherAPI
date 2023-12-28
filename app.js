const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", function (req, res) {
    // console.log(req.body.cityName);
    //fetch data from external server
    const query = req.body.cityName;
    const apikey=process.env.Key;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey + "&units=" + unit;
    https.get(url, function (response) {
        console.log(response.statusCode);//to check whther we get data or not from api

        response.on("data", function (data) {//hold of data from response(on method)
            // console.log(data);
            const weatherData = JSON.parse(data);//convert json string to object
            const temp = weatherData.main.temp;//to get specific key
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            // console.log(weatherDescription);
            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<h1>The temperature in " + query + " is " + temp + "degrees Celcius.</h1>");
            res.write("<img src=" + imageURL + " >")
            res.send()//multiple write methdos allowed but not send()
        })
    });//only one send in these app.get method
    // res.send("Server is up and running");
})


app.listen(3000, function () {
    console.log("Server is running on port 3000.");
})