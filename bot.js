const Discord = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const client = new Discord.Client();
const discord_token = process.env.DISCORD_TOKEN;

client.once("ready", () => {
  console.log("bot is online");
});

client.on("message", (msg) => {
  if (
    msg.content.toLowerCase() === "hello" ||
    msg.content.toLowerCase() === "hi"
  ) {
    msg.reply(`Hello ${msg.author.username}`);
  }
});

const weather_token = process.env.OPEN_WEATHER_API_KEY;
const city = "Honolulu";
const weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weather_token}`;

axios
  .get(weatherURL)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });

// Bot login -- keep at end of file
client.login(discord_token);
