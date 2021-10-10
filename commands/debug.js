const fs = require("fs");

module.exports = {
    name: "debug",
    description: "Send a log message with debug info",
    async execute(message, args, cmd, client, Discord) {
        console.log(`${this.name}`);

    const txtFile = fs.readFileSync("./welcome_messages.txt", 'utf-8');
    const messagesArray = txtFile.split("@@@").filter((messagesArray) => messagesArray.length > 3);
    const welcomeMessage = () => {
        const random = Math.floor(Math.random() * messagesArray.length);
        return messagesArray[random];
    }
    // for (let i = 0; i < messagesArray.length; i++)
    console.log(messagesArray[args]);
    message.guild.channels.cache.get("895552357230866442").send(`>>> ${welcomeMessage()}`);
    }
}