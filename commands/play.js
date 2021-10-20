const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const {createAudioPlayer, createAudioResource, NoSubscriberBehavior} = require('@discordjs/voice');
const queue = new Map();

module.exports = {
    name: 'play',
    aliases: ['p', 'pause', 'resume', 'stop', 'skip', 'playlist'],
    description: 'joins a server and play a song',
    async execute(message, args, cmd, client, Discord) {
        console.log(`---player---`); // console log command's name

        if (!message.member.voice.channel) return message.channel.send('>>> You must be in a voice channel'); // Verify if user is on a voice channel
        const guild = message.guild;
        const guildInfo = queue.get(guild.id);
        if (guildInfo) {
            const player = guildInfo.player;
        }

        // Verify permissions
        const permissions = message.member.voice.channel.permissionsFor(message.client.user);
        if (permissions) { // Get permisssions from user
            if (!permissions.has('CONNECT'))
                return message.channel.send(`>>> I DO NOT have the permission to **CONNECT** to this channel`); // Can't conenct
            if (!permissions.has('SPEAK'))
                return message.channel.send(`>>> I DO NOT have the permission to **SPEAK** in this channel`); // Can't Speak
            if (!args.length && (cmd == 'play' || cmd == 'p'))
                return message.channel.send(`>>> You need to type a song name or a link`); // Verify arguments
        }

        

        if (cmd === 'play' || cmd === 'p') {
            const songInfo = await songFinder(args); // returns {title: [String], url: [String]}
            if (!queue.get(guild.id)) { // True if bot is not connected to a voice channel in the current guild
                const queueConstructor = {
                    voiceChannel: message.member.voice.channel,
                    textChannel: message.channel,
                    player: player = createAudioPlayer({
                        behaviors: {
                            noSubscriber: NoSubscriberBehavior.Pause,
                        },
                    }),
                    connection: null,
                    loop: false,
                    pause: false,
                    songs: []
                }
                queueConstructor.songs.push(songInfo);
                queue.set(guild.id, queueConstructor);
                try {
                    const connection = client.commands.get("join").execute(message);
                    queueConstructor.connection = connection;
                    connection.subscribe(player);
                    audio_player(message, guild);
                } catch (err) {
                    queue.delete(guild.id); // Delete queue info on error
                    message.channel.send(`>>> There was an error connecting!`);
                    throw err;
                }
            } else {
                queue.get(guild.id).songs.push(songInfo);
                if (player.state.status === 'idle')
                    audio_player(message, guild);
                return message.channel.send(`>>> 👍 **${songInfo.title}** added to queue! 👍`);
            }
        } else if (cmd === 'pause') { //true if playing
            if (guildInfo) {
                if (player.state.status === 'playing' && !guildInfo.pause) {
                    player.pause();
                    guildInfo.pause = true;
                    return message.channel.send(`>>> ✋ Song paused ✋`);
                }
            }
        } else if (cmd === 'resume') {
            if (guildInfo) {
                if (player.state.status === 'paused' && guildInfo.pause) {
                    player.unpause();
                    guildInfo.pause = false;
                    return message.channel.send(`>>> ▶️ Song resumed ▶️`);
                }
            }
        } else if (cmd === 'stop') {
            if (guildInfo) {
                player.stop();
                return message.channel.send(`>>> ⛔ Song stoped ⛔`);
            }
        } else if (cmd === 'skip') {
            if (guildInfo && guildInfo.songs) {
                message.channel.send(`>>> ⏭️ Skipping song ⏭️`);
                return audio_player(message, guild);
            }
        } else if (cmd === 'playlist') {
            if (guildInfo) {
                songsQueue = guildInfo.songs;
                if (args.length != 0) {
                    const index = parseInt(args[0]);
                    if (Number.isInteger(index) && index <= songsQueue.length) {
                        const splicedElement = songsQueue.splice(index);
                        songsQueue.unshift(splicedElement[0]);
                        return audio_player(message, guild);
                    } else {
                        message.channel.send(`>>> 🛑 Ingresa una posición en la playlist válida 🛑`);
                    }
                }
                if (songsQueue.length != 0) {
                    let text = "";
                    songsQueue.forEach((song, index) => {
                        text += `#${index+1} - ${song.title}\n`;
                    });
                    return message.channel.send(`>>> *_*_*_*_*_*_*_*_*_*_*_*_*__**Songs Queue**__*_*_*_*_*_*_*_*_*_*_*_*_* \n\n${text}`);
                }
            }
        }

        //Delete the guild info from the queue when the bot leaves the voice channel
        client.on('voiceStateUpdate', (oldState, newState) => {
            if (newState.id === client.application.id) {
                if (newState.channelId === null) {
                    queue.delete(message.channel.id);
                }
            }
        });
    }
}

// Search a song 
const songFinder = async (args) => {
    if (ytdl.validateURL(args[0])) {
        const song_info = await ytdl.getInfo(args[0]);
        return song = {title: song_info.videoDetails.title, url: song_info.videoDetails.video_url}
    } else {
        const video_finder = async (query) => {
            const videoResult = await ytSearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }
        const video = await video_finder(args.join(' '));
        if (video) {
            return song = {title: video.title, url: video.url}
        } else {
            message.channel.send(`>>> Error finding the video.`);
        }
    }
}


const audio_player = async (message, guild) => {
    const player = queue.get(guild.id).player;
    const songsQueue = queue.get(guild.id).songs;
    const song = songsQueue.shift();
    const stream = ytdl(song.url, {filter: 'audioonly'});
    const resource = createAudioResource(stream);
    player.play(resource);

    await message.channel.send(`>>> 🎶 Now playing **${song.title}** 🎶`);
}
