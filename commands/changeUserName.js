module.export = {
    name: "changeusername",
    description: "Change users display name",
    execute(message, args, cmd, client, Discord) {
        console.log(`changeUserName`);
        const oldName = message.member.nickname;
        const newName = `🤖 ${oldName}`
        console.log(`oldName: ${oldName}`);
        console.log(`newName: ${newName}`);
        // message.member.setUsername(newName);
    }
}
