const {getVoiceConnection} = require("@discordjs/voice");
/* 
    client.commands.get("leave").execute(message) // copy to leave
*/
module.exports = {
    name: "leave",
    description: "leaves the current voice channel",
    execute(message) {
        console.log(`Leaving voice channel`);
        const connection = getVoiceConnection(message.guild.id);

        if (!connection)
            return message.reply(`>>> 😔  Currently I'am NOT in a voice channel  😔`);

        message.channel.send(`>>> 🔇 Leaving **${message.member.voice.channel}** voice channel 🔇`)
        connection.destroy();
    }
}

