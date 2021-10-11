const config = require("../../settings.json");

module.exports = (client, Discord, message)=> {
    const prefix = config.prefix; //Command Prefix

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd);

    if (command) command.execute(message, args, cmd, client, Discord);
}