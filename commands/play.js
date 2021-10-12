const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const {createAudioPlayer ,createAudioResource, getVoiceConnection,} = require('@discordjs/voice');
const {Player} = require('discord-music-player');
const queue = new Map();


module.exports = {
    name: 'play',
    description: 'joins a server and play a song',
    async execute(message, args, cmd, client, Discord) {
        console.log(`${this.name}`); // console log command's name
        
        // Main info
        const member = message.member; // member info
        const textChannel = message.channel; // Text channel where the command was called
        const guild = message.guild; // guild info
        const voiceChannel = message.member.voice.channel; // Voice channel of the message's author
        if (!voiceChannel) return textChannel.send('>>> You must be in a voice channel'); // Verify if user is on a voice channel
        
        // Verify permissions
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (permissions) { // Get permisssions from user
            if (!permissions.has('CONNECT'))
                return textChannel.send(`>>> I DO NOT have the permission to **CONNECT** to this channel`); // Can't conenct
            if (!permissions.has('SPEAK'))
                return textChannel.send(`>>> I DO NOT have the permission to **SPEAK** in this channel`); // Can't Speak
            if (!args.length)
                return textChannel.send(`>>> You need to type a song name or a link`); // Verify arguments
        }

        const player = createAudioPlayer();
        const connection = await createConnection(message, client, guild);

        // Player controls switch
        if (cmd === 'play') {
            const songInfo = await songFinder(args); // returns {title: [String], url: [String]}
            if (!queue.size) { // Fist call, create the connection and queue of songs
                const queueConstructor = {
                    voiceChannel: voiceChannel,
                    textChannel: textChannel,
                    connection: null,
                    songs: []
                }
                queueConstructor.songs.push(songInfo);
                queue.set(guild.id, queueConstructor);
                try {
                    queueConstructor.connection = connection;
                    video_player(message, player, guild);
                } catch (err) {
                    queue.delete(guild.id); // Delete queue info on error
                    textChannel.send(`>>> There was an error connecting!`);
                    throw err;
                }
            } else {
                queue.get(guild.id).songs.push(songInfo);
                return textChannel.send(`>>> 👍 **${songInfo.title}** added to queue! 👍`);
            }
        }

        client.on("voiceStateUpdate", (oldState, newState) => {
            if (newState.id === client.application.id) {
                if (newState.channelId === null) {
                    queue.delete(guild.id);
            }
        }});
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
            textChannel.send(`>>> Error finding the video.`);
        }
    }
}


const video_player = async (message, player, guild) => {
    const songsQueue = queue.get(guild.id).songs;
    if (!songsQueue.length) {
        client.commands.get('leave').execute(message)
        queue.delete(guild.id);
        return;
    }
    song = songsQueue.shift();
    const stream = ytdl(song.url, {filter: 'audioonly'});
    const resource = createAudioResource(stream);
    connection = queue.get(guild.id).connection;
    connection.subscribe(player);
    
    await message.channel.send(`>>> 🎶 Now playing **${song.title}** 🎶`);
}

const createConnection = async (message, client, guild) => {
    connection = getVoiceConnection(guild.id);
    if(connection) return connection
    return connection = client.commands.get('join').execute(message, false); // Bot joins the voice channel

}