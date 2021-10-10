const fs = require("fs"); // File Search, interact with file system

module.exports = (client, Discord) => {
    const command_files = fs.readdirSync("./commands/").filter(file => file.endsWith(".js")); // Read "commands" directory and filter .JS files

    for (const file of command_files) {
        const command = require(`../commands/${file}`);
        if (command.name) {
            client.commands.set(command.name, command);
        }
        else {
            continue;
        }
    }
}
