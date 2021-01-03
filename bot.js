const Discord = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const client = new Discord.Client();
const discord_token = process.env.DISCORD_TOKEN;

client.once("ready", () => {
  console.log("bot is online");
});

//Checks to see if message is prefixed w/ an "!"
const prefix = "!";

client.on("message", (msg) => {
  if (msg.content[0] !== prefix) {
    console.log("no prefix");
    return;
  }
  //Gets the command/prompt from the user
  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  console.log(args[0]);
  console.log(command);

  //Greeting
  if (command === "hello" || command === "hi") {
    msg.reply(`Hello ${msg.author.username}`);
  }

  // ego boast
  if (command === "ego") {
    axios
      .get("https://complimentr.com/api", {
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        const compliment = response.data.compliment;
        msg.react("😀");
        msg.reply(`${compliment} :sparkles:`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Current Weather
  if (command === "weather") {
    const weather_token = process.env.OPEN_WEATHER_API_KEY;
    const city = args[0];
    const weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weather_token}`;

    axios
      .get(weatherURL)
      .then((response) => {
        const temp = parseFloat(
          1.8 * (response.data.main.temp - 273) + 32
        ).toFixed(2);
        const feelsLike = parseFloat(
          1.8 * (response.data.main.feels_like - 273) + 32
        ).toFixed(2);
        msg.reply(`Current temperature is ${temp}F`);
        msg.reply(`Feels like ${feelsLike}F`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Weather Forecast

  if (command === "forecast") {
    const rapidapi_key = process.env.RAPID_API_KEY;
    const location = args[0];
    const geocodingURL = `https://google-maps-geocoding.p.rapidapi.com/geocode/json?language=en&address=${location}&rapidapi-key=${rapidapi_key}`;

    const weatherForecast = async () => {
      const response = await axios(geocodingURL);
      const lat = response.data.results[0].geometry.location.lat;
      const lon = response.data.results[0].geometry.location.lng;

      const weather_token = process.env.OPEN_WEATHER_API_KEY;
      const weatherForecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${weather_token}`;

      axios
        .get(weatherForecastURL)
        .then((response) => {
          //msg.reply(response);
          for (let i = 1; i < 4; i++) {
            const unixTime = response.data.daily[i].dt;
            const sunrise = response.data.daily[i].sunrise;
            const sunset = response.data.daily[i].sunset;
            const pressure = response.data.daily[i].pressure;
            const humidity = response.data.daily[i].humidity;
            const wind = response.data.daily[i].wind_speed;
            const condition = response.data.daily[i].weather[0].description;
            const icon = response.data.daily[i].weather[0].icon;
            const milliseconds = unixTime * 1000;
            const dateObject = new Date(milliseconds);
            const readableDate = dateObject.toLocaleString();
            console.log(readableDate, "@#@#$@#$@#$@#");
            console.log("day " + i);
            console.log(unixTime, "DATTTTE");
            console.log(pressure, "DATTTTE");
            console.log(humidity, "DATTTTE");
            console.log(wind, "DATTTTE");
            console.log(condition, "DATTTTE");
            console.log(icon, "DATTTTE");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    weatherForecast();
  }

  //random dad jokes
  if (command === "dadjoke" || command === "dadjokes") {
    axios
      .get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        const joke = response.data.joke;
        console.log(response.data);
        msg.reply(joke);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //random chuck norris jokes
  if (command === "chuck") {
    axios
      .get("https://api.chucknorris.io/jokes/random", {
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        const chuckJoke = response.data.value;
        msg.reply(chuckJoke);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //random insults
  if (command === "insult" || command === "insults") {
    axios
      .get("https://evilinsult.com/generate_insult.php")
      .then((response) => {
        const burn = response.data;
        msg.reply(burn);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Get NBA scores for the day
  if (command === "nba") {
    const rapidapi_key = process.env.RAPID_API_KEY;
    const date = args[0];
    const nbaScoreURL = `https://api-nba-v1.p.rapidapi.com/games/date/${date}?rapidapi-key=${rapidapi_key}`;
    axios
      .get(nbaScoreURL)
      .then((response) => {
        const nbaData = response.data.api.games;
        console.log(nbaData);
        //api.games
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// Bot login -- keep at end of file
client.login(discord_token);
