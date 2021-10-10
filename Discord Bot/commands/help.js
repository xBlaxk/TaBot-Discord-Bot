const fs = require("fs");

module.exports = {
    name: "help",
    description: "Sends a message with all the list of commands",
    execute(message, args, cmd, client, Discord) {
        console.log(`${this.name}`)

        const txtHelp = fs.readFileSync("./help.txt", 'utf-8');
        message.channel.send(txtHelp);
    }
}