const fs = require("fs");
const {MessageEmbed} = require("discord.js");
const embedMessage = new MessageEmbed()
.setColor('#0099ff')
.setTitle('')
.setDescription('Some description here')
.setThumbnail('https://i.imgur.com/8g4U8tu.png');

module.exports = {
    name: "help",
    description: "Sends a message with all the list of commands",
    execute(message, args, cmd, client, Discord) {

        console.log(`${this.name}`)
        const txtHelp = fs.readFileSync("./help.txt", 'utf-8');
        message.channel.send({embeds: [embedMessage.setDescription(txtHelp)]});
    }
}