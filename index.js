//Requires nodes
const {Client, Intents} = require("discord.js"); 
const Discord = require('discord.js');
const config = require("./settings.json");

//Bot Intents
const myIntents = new Intents(); // Declare and incialize myIntents with a null Intents class
myIntents.add(Intents.FLAGS.GUILDS, // Add Bot Intents to myIntents array
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES);
const client = new Client({intents: myIntents}); // Inicialize client with Bot Intents

// Handler collections
client.commands = new Discord.Collection(); // Create a collections of commands
client.events = new Discord.Collection(); // Create a collections of events

const handlers = ["command_handler", "event_handler"];
handlers.forEach((handler) => {
    require(`./handlers/${handler}`)(client, Discord);
});

//TESTING

// Logs the client in, establishing a websocket connection to Discord
client.login(config.token);
