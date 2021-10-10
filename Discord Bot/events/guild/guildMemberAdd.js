const fs = require("fs");

module.exports = (client, Discord, member) => {
    console.log(`New user in the server: ${member.user.username}`);
    const txtFile = fs.readFileSync("./welcome_messages.txt", 'utf-8');
    const messagesArray = txtFile.split("@@@").filter((messagesArray) => messagesArray.length > 3);
    const welcomeMessage = () => {
        const random = Math.floor(Math.random() * messagesArray.length);
        return messagesArray[random];
    }
    member.guild.channels.cache.get("822247262671208529").send(`>>> ${welcomeMessage()}`);
}