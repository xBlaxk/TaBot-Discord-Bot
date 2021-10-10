module.exports = {
    name: "hello",
    description: "Say hello to the autor of the message",
    execute(message) {
        console.log(`${this.name}`)
        message.reply(`>>> 🥰 Hello **${message.author.username}** I hope you have a great day in the server 🥰`);
    }
}