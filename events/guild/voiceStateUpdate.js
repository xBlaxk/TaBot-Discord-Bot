const {getVoiceConnection} = require("@discordjs/voice");
const {MessageEmbed} = require('discord.js');
const guilds = new Map();
const embedMessage = new MessageEmbed()
.setColor('#0099ff')
.setTitle('Voice Channel Update')
.setDescription('Some description here')
.setThumbnail('https://imgur.com/6DafL6d');

module.exports = (client, Discord, oldState, newState) => {

   if (!guilds.get(newState.guild.id)) {
      const guildConstructor = {
         inOutChat: "907029653238186045"
      }
      guilds.set(newState.guild.id, guildConstructor);
   }

   // it's called by this bot
   if (newState.id === client.application.id) { // True if the event is from this bot
      if (newState.channelId !== null) {
         // Execute joining leaving a voice channel
      } else {
         // Execute when leaving a voice channel
         const connection = getVoiceConnection(newState.guild.id);
         if (connection)
            connection.destroy();
      }
      return;
   }

   // it's called by a user
   if (!newState.member.user.bot) { // True if not a bot
      if (newState.channelId) { // Execute when joining a voice channel
         // Send message about who joined a voice channel
         if (newState.channelId != null && oldState.channelId != null) {
            // newState.guild.channels.cache.get(guilds.get(newState.guild.id).inOutChat).send(`>>> <@${newState.id}> switched from ${newState.guild.channels.cache.get(oldState.channelId)} to ${newState.guild.channels.cache.get(oldState.channelId)}`);
            newState.guild.channels.cache.get(guilds.get(newState.guild.id).inOutChat).send({embeds: [embedMessage.setDescription(`<@${newState.id}> switched from ${newState.guild.channels.cache.get(oldState.channelId)} to ${newState.guild.channels.cache.get(oldState.channelId)}`).setThumbnail('https://imgur.com/GM42bcQ.png')]});
         } else {
            newState.guild.channels.cache.get(guilds.get(newState.guild.id).inOutChat).send({embeds: [embedMessage.setDescription(`<@${newState.id}> joined ${newState.guild.channels.cache.get(newState.channelId)}`).setThumbnail('https://imgur.com/eEFapTb.png')]});
         }
      } else { // Execute when leaving a voice channel
         // Send message about who joined a voice channel
         oldState.guild.channels.cache.get(guilds.get(oldState.guild.id).inOutChat).send({embeds: [embedMessage.setDescription(`<@${oldState.id}> joined ${oldState.guild.channels.cache.get(oldState.channelId)}`).setThumbnail('https://imgur.com/6DafL6d.png')]});
      }
   }
}
