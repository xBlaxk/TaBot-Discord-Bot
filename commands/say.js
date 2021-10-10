const {User} = require("discord.js");
const guildMemberAdd = require("../events/guild/guildMemberAdd");

module.exports = {
    name: "say",
    description: "Replay with same message",
    execute(message, args, cmd, client, Discord) {
        console.log(`${this.name}`);

        if (!args.length) {
             message.channel.send(`>>> Syntax: **>${this.name}** <text>`);
             return;
        }

        message.delete();
        console.log(args);
        message.channel.send(`>>> ${args.join(" ")}`);
    }
}