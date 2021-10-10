const {getVoiceConnection} = require("@discordjs/voice");

module.exports = (client, Discord, oldState, newState)=> {

   // it's called by this bot
   if (newState.id === client.application.id) { // True if the event is from this bot
      if (newState.channelId !== null)
      {
         // Execute joining leaving a voice channel
         
      } else {
         // Execute when leaving a voice channel
         const connection = getVoiceConnection (newState.guild.id);
         if (connection)
            connection.destroy();
      } 
      return;
   }

   // it's called by a user
   if (!newState.user.bot) { // True if not a bot
      if (newState.channelID !== null) {
         // Execute joining leaving a voice channel

      } else { 
         // Execute when leaving a voice channel

      }
   }
}
