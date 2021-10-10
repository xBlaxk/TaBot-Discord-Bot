const fs = require("fs"); // File Search, interact with file system

module.exports = (client, Discord) => {
    const load_dir = (dir) => {
        const event_files = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith(".js"));
        
        for (const file of event_files) {
            const event = require(`../events/${dir}/${file}`);
            const event_name = file.split(".")[0];
            client.on(event_name, event.bind(null, client, Discord));
        }
    }

    const foldersArray = ["client", "guild"];
    foldersArray.forEach((e) => load_dir(e));

}
