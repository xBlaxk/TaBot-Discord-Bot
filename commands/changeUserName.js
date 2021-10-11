module.exports = {
    name: "changeusername",
    description: "Change users display name",
    execute(message, args, cmd, client, Discord) {
        console.log(`changeUserName`);
        const testBotId = "773714252200149043";
        const testUser = message.guild.members.cache.get("user ID here");
        console.log(testUser.id);
        // const oldName = message.member.nickname;
        // const oldName = testUser.user.username;


        // const newName = `🤖 ${oldName}`
        // console.log(`oldName: ${oldName}`);
        // console.log(`newName: ${newName}`);
        // message.member.setUsername(newName);
    }
}
