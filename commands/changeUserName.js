module.export = {
    name: "changeusername",
    description: "Change users display name",
    execute(message, args, cmd, client, Discord) {
        console.log();
        message.member.setNickname("🤖 >_");
    }
}
