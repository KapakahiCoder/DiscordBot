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

  if (command === "hello" || command === "hi") {
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
