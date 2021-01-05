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
    return;
  }
  //Gets the command/prompt from the user
  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  //Greeting
  const greetings = [
    "Hello 👋",
    "Aloha 🤙🏽",
    "Konnichiwa  ⛩ ",
    "Greetings 😀",
    "Ola  🌞",
    "Bonjour 🍷",
    "Guten tag 🍺",
    "Namaste 🇮🇳",
    "Nihao 🐼",
  ];
  if (command === "hello" || command === "hi") {
    const random = Math.floor(Math.random() * greetings.length + 1);
    msg.reply(` ${greetings[random]}`);
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
        msg.reply(`❤️ ${compliment} :sparkles:`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Current Weather
  if (command === "weather") {
    const weather_token = process.env.OPEN_WEATHER_API_KEY;
    const city = args[0];
    const weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weather_token}`;

    axios
      .get(weatherURL)
      .then((response) => {
        const icon = response.data.weather[0].icon;
        const condition = response.data.weather[0].description;
        const temp = response.data.main.temp;
        const feelsLike = response.data.main.feels_like;
        const humidity = response.data.main.humidity;
        const pressure = response.data.main.pressure;
        const wind = response.data.wind.speed;

        const currentMilliseconds = response.data.dt * 1000;
        const dateObject = new Date(currentMilliseconds);
        const todayDate = dateObject
          .toLocaleString()
          .split(" ")[0]
          .slice(0, -1);

        const sunriseMilliseconds = response.data.sys.sunrise * 1000;
        const sunriseObject = new Date(sunriseMilliseconds);
        const sunriseReadable = sunriseObject.toLocaleString().split(" ");
        sunriseReadable.shift();
        const sunriseTime = sunriseReadable.join(" ");

        const sunsetMilliseconds = response.data.sys.sunset * 1000;
        const sunsetObject = new Date(sunsetMilliseconds);
        const sunsetReadable = sunsetObject.toLocaleString().split(" ");
        sunsetReadable.shift();
        const sunsetTime = sunsetReadable.join(" ");

        const todayWeatherEmbed = new Discord.MessageEmbed()
          .setColor(0x34c6eb)
          .setTitle(`🛰️ Weather for ${todayDate}`)
          .setAuthor(`Requested by ${msg.author.username}`)
          .addFields(
            { name: "Current temp 🌡️ ", value: `${temp}F`, inline: true },
            { name: "Feels like  🌈 ", value: `${feelsLike}F`, inline: true },
            { name: "Condtions  🌎 ", value: condition, inline: true }
          )
          .addFields(
            { name: "Humidity 💦", value: `${humidity}%`, inline: true },
            { name: "Pressure  💫 ", value: `${pressure} hPa`, inline: true },
            { name: "Wind 🌬️", value: `${wind} mph`, inline: true },
            { name: "Sunrise 🌅", value: sunriseTime, inline: true },
            { name: "Sunset 🌇", value: sunsetTime, inline: true }
          )
          .setThumbnail(`http://api.openweathermap.org/img/w/${icon}`)
          .setTimestamp();
        try {
          msg.channel.send(todayWeatherEmbed);
        } catch {
          msg.reply("Sorry, there was an error. Please try again later.");
        }
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
      const weatherForecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${weather_token}`;

      axios
        .get(weatherForecastURL)
        .then((response) => {
          for (let i = 1; i < 4; i++) {
            const mornTemp = response.data.daily[1].temp.morn;
            const dayTemp = response.data.daily[1].temp.day;
            const eveningTemp = response.data.daily[1].temp.eve;
            const nightTemp = response.data.daily[1].temp.night;

            const humidity = response.data.daily[i].humidity;
            const wind = response.data.daily[i].wind_speed;
            const condition = response.data.daily[i].weather[0].description;
            const icon = response.data.daily[i].weather[0].icon;

            const forecastMilliseconds = response.data.daily[i].dt * 1000;
            const dateObject = new Date(forecastMilliseconds);
            const forecastDate = dateObject
              .toLocaleString()
              .split(" ")[0]
              .slice(0, -1);

            const weatherForecast = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setTitle(`Weather Report for ${forecastDate}`)
              .setAuthor(`Requested by ${msg.author.username}`)
              .addFields(
                {
                  name: "Morning Temp  🌡",
                  value: `${mornTemp}F`,
                  inline: true,
                },
                {
                  name: "Day Temp  🌞",
                  value: `${dayTemp}F`,
                  inline: true,
                },
                {
                  name: "Evening Temp  🌜",
                  value: `${eveningTemp}F`,
                  inline: true,
                },
                {
                  name: "Night Temp 🌃",
                  value: `${nightTemp}F`,
                  inline: false,
                }
              )
              .addFields(
                { name: "Conditions 🌲", value: condition, inline: true },
                { name: "Humidity  😰 ", value: `${humidity}%`, inline: true },
                { name: "Wind  💨 ", value: `${wind} mph`, inline: true }
              )

              .setThumbnail(`http://api.openweathermap.org/img/w/${icon}`)
              .setTimestamp();
            try {
              msg.channel.send(weatherForecast);
            } catch {
              msg.reply("Sorry, there was an error. Please try again later");
            }
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
        msg.reply("🥋 " + chuckJoke);
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
        msg.reply("💀 " + burn);
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

        nbaData.forEach((game) => {
          let homeScore = parseInt(game.hTeam.score.points);
          let awayScore = parseInt(game.vTeam.score.points);

          //if home team wins, home team logo is set to image and away team is thumbnail
          //Will refactor this later
          if (homeScore >= awayScore) {
            const scoreEmbed = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setTitle("NBA.com")
              .setURL("http://www.nba.com")
              .setDescription("🏀 Game results:")
              .setAuthor(`Requested by ${msg.author.username}`)
              .addFields(
                {
                  name: "Home Team 🏠",
                  value: `${game.hTeam.fullName}
                  😀 ${homeScore}`,
                  inline: true,
                },
                {
                  name: "Away Team ✈️",
                  value: `${game.vTeam.fullName}
                  😢 ${awayScore}`,
                  inline: true,
                }
              )
              .setImage(game.hTeam.logo, { size: 50 })
              .setThumbnail(game.vTeam.logo)
              .setFooter(game.statusGame)
              .setTimestamp();
            try {
              msg.channel.send(scoreEmbed);
            } catch {
              msg.reply("Sorry, there was an error. Please try again later");
            }
            // away team is winner, so their logo is set to image and home team is thumbnail
            //Will refactor this part later
          } else {
            const scoreEmbed = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setTitle("NBA.com")
              .setURL("http://www.nba.com")
              .setDescription("🏀 Game results:")
              .setAuthor(`Requested by ${msg.author.username}`)
              .addFields(
                {
                  name: "Home Team 🏠",
                  value: `${game.hTeam.fullName}
                  😢 ${homeScore}`,
                  inline: true,
                },
                {
                  name: "Away Team ✈️",
                  value: `${game.vTeam.fullName}
                  😀 ${awayScore}`,
                  inline: true,
                }
              )
              .setImage(game.vTeam.logo, { size: 50 })
              .setThumbnail(game.hTeam.logo)
              .setFooter(game.statusGame)
              .setTimestamp();
            try {
              msg.channel.send(scoreEmbed);
            } catch {
              msg.reply("Sorry, there was an error. Please try again later");
            }
          }
          //msg.channel.send("🏀🏀🏀🏀🏀🏀🏀🏀🏀");
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  if (command === "help") {
    const helpEmbed = new Discord.MessageEmbed()
      .setColor(0xbbdaed)
      .setTitle("Help Commands")
      .setThumbnail("https://imgur.com/wUqA2Xr")
      .addFields(
        { name: "!hi or !hello", value: "Replies with a random greeting 👋" },
        { name: "!chuck", value: "Get a Chuck Norris joke 🤣" },
        { name: "!dadjoke", value: "Get a funny(?) dad joke 👨" },
        { name: "!ego", value: "Boost your ego 🚀" },
        {
          name: "!nba yyyy-mm-dd",
          value: "See all NBA scores for that day ⛹️‍♂️",
        },
        {
          name: "!weather city-name or !weather zipcode",
          value: "Get current weather ☂️",
        },
        {
          name: "!forecast city-name or !forecast zipcode",
          value: "Get a 3-day weather forecast ❄️",
        },
        { name: "!help", value: "See all the Discort bot commands 📝" }
      )
      .setTimestamp();
    try {
      msg.author.send(helpEmbed);
    } catch {
      msg.reply("Sorry, there was an error. Please try again later.");
    }
  }
});

// Bot login -- keep at end of file
client.login(discord_token);
