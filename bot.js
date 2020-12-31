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
    msg.react("😀");
    msg.reply(`You are amazing ${msg.author.username} :sparkles:`);
  }

  //Weather forecast
  if (command === "weather") {
    const weather_token = process.env.OPEN_WEATHER_API_KEY;
    const city = args[0];
    const weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weather_token}`;

    axios
      .get(weatherURL)
      .then((response) => {
        // msg.reply(response);
        const temp = parseFloat(
          1.8 * (response.data.main.temp - 273) + 32
        ).toFixed(2);
        const feelsLike = parseFloat(
          1.8 * (response.data.main.feels_like - 273) + 32
        ).toFixed(2);
        console.log(response);
        console.log(response.data.main.temp);
        msg.reply(`Current temperature is ${temp}F`);
        msg.reply(`Feels like ${feelsLike}F`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //random dad jokes
  if (command === "dadjoke") {
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
});

// Bot login -- keep at end of file
client.login(discord_token);
