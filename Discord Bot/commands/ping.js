module.exports = {
    name: "ping",
    description: "This is a ping command!",
    execute(message, args, cmd, client, Discord) {
        console.log(`${this.name}`)
        message.channel.send(`>>> pong`);
    }
}