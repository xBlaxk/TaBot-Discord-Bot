const {User} = require("discord.js");
const guildMemberAdd = require("../events/guild/guildMemberAdd");

module.exports = {
    name: "say",
    description: "Replay with same message",
    execute(message, args, cmd, client, Discord) {
        console.log(`${this.name}`);
        const member = message.member;

        if (!args.length) {
             message.channel.send(`>>> Syntax: **>${this.name}** <text>`);
             return;
        }

        console.log(args);
        message.channel.send(`>>> ${member.user.username} says: ${args.join(" ")}`);
    }
}