module.export = {
    name: "changeusername",
    description: "Change users display name",
    execute(message, args, cmd, client, Discord) {
        message.member.setNickname("🤖 >_");
    }
}
