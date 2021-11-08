const {getVoiceConnection} = require("@discordjs/voice");
const {MessageEmbed} = require('discord.js');
const embedMessage = new MessageEmbed()
.setColor('#0099ff')
.setTitle('Voice Channel Update')
.setDescription('Some description here')
.setThumbnail('https://i.imgur.com/bIGAJ17.png');

/* 
    client.commands.get("leave").execute(message) // copy to leave
*/
module.exports = {
    name: "leave",
    description: "leaves the current voice channel",
    execute(message) {
        console.log(`Leaving voice channel`);
        console.log(`Stablishing connection with the voice channel`)

        const connection = getVoiceConnection(message.guild.id);

        if (!connection)
            return message.reply({embeds: [embedMessage.setDescription(`😔  Currently I'am NOT in a voice channel  😔`).setThumbnail(``)]});

        message.channel.send({embeds: [embedMessage.setDescription(`🔇 Leaving **${message.member.voice.channel}** voice channel 🔇`)]});
        connection.destroy();
    }
}

