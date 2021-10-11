module.exports = {
    name: "say",
    description: "Replay with same message",
    execute(message, args, cmd, client, Discord) {
        console.log(`${this.name}`);

        if (!args.length) {
             message.channel.send(`>>> Syntax: **>${this.name}** <text>`);
             return;
        }

        message.delete();
        message.channel.send(`>>> ${args.join(" ")}`);
    }
}