const {joinVoiceChannel, getVoiceConnection} = require("@discordjs/voice");
/* 
    client.commands.get("join").execute(message) // copy to join
*/
module.exports = {
    name: "join",
    description: "join author's voice channel",
    execute(message, event) {
        console.log(`Stablishing connection with the voice channel`)
        
        if (!message.member.voice.channel)
            return message.channel.send(">>> You must be in a voice channel")
        if (getVoiceConnection(message.guild.id) && event) 
            return message.reply(`>>> ⛔  I'am already in a voice channel  ⛔`);
        
        message.channel.send(`>>> 🔉 Joining **${message.member.voice.channel}** voice channel 🔉`);
        return joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });
    }
}

