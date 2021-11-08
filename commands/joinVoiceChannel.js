const {joinVoiceChannel, getVoiceConnection} = require("@discordjs/voice");
const {MessageEmbed} = require('discord.js');
const embedMessage = new MessageEmbed()
.setColor('#0099ff')
.setTitle('Voice Channel Update')
.setDescription('Some description here')
.setThumbnail('https://i.imgur.com/eEFapTb.png');

/* 
    client.commands.get("join").execute(message) // copy to join
*/
module.exports = {
    name: "join",
    description: "join author's voice channel",
    execute(message, event) {
        console.log(`Stablishing connection with the voice channel`)

        if (!message.member.voice.channel)
            return message.reply({embeds: [embedMessage.setDescription(`You must be in a voice channel`).setThumbnail('')]});
        if (getVoiceConnection(message.guild.id) && event) 
            return message.reply({embeds: [embedMessage.setDescription(`⛔  I'am already in a voice channel  ⛔🔉`).setThumbnail('')]});
        
        message.channel.send({embeds: [embedMessage.setDescription(`🔉 Joining **${message.member.voice.channel}** voice channel 🔉`)]});
        return joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });
    }
}

