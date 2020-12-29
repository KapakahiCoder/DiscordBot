const Discord = require("discord.js");
require("dotenv").config();

const client = new Discord.Client();
const discord_token = process.env.DISCORD_TOKEN;

client.once("ready", () => {
  console.log("bot is online");
});

// Set avatar
client.user
  .setAvatar("mene.jpg")
  .then((user) => console.log("New avatar set!"))
  .catch(console.error);

// Bot login -- keep at end of file
client.login(discord_token);
