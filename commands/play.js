const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const {createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus} = require('@discordjs/voice');
const {MessageEmbed} = require('discord.js');
const embedMessage = new MessageEmbed()
.setColor('#0099ff')
.setTitle('Audio Player')
.setDescription('Some description here')
.setThumbnail('https://i.imgur.com/xFuz8BX.png');

const queue = new Map();
let setEvents = true;
module.exports = {
    name: 'play',
    aliases: ['p', 'pause', 'resume', 'stop', 'skip', 'playlist', 'remove'],
    description: 'joins a server and play a song',
    async execute(message, args, cmd, client, Discord) {
        console.log(`---player---`); // console log command's name

        if (!message.member.voice.channel) return message.channel.send('>>> You must be in a voice channel'); // Verify if user is on a voice channel
        const guild = message.guild;
        const guildInfo = queue.get(guild.id);
        // Verify permissions
        const permissions = message.member.voice.channel.permissionsFor(message.client.user);
        if (permissions) { // Get permisssions from user
            if (!permissions.has('CONNECT'))
                return message.reply({embeds: [embedMessage.setDescription(`I DO NOT have the permission to **CONNECT** to this channel`)]}); // Can't conenct
            if (!permissions.has('SPEAK'))
                return message.reply({embeds: [embedMessage.setDescription(`I DO NOT have the permission to **SPEAK** in this channel`)]}); // Can't Speak
            if (!args.length && (cmd == 'play' || cmd == 'p'))
                return message.reply({embeds: [embedMessage.setDescription(`You need to type a song name or a link`)]}); // Verify arguments
        }
        if (cmd === 'p')
            cmd = 'play';
        
        const PLAYER_CONTROL = {
            'play': async () => {
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
                        message.reply({embeds: [embedMessage.setDescription(`There was an error connecting!`)]});
                        throw err;
                    }
                } else {
                    queue.get(guild.id).songs.push(songInfo);
                    if (player.state.status === 'idle' || player.state.status === 'autopaused')
                        audio_player(message, guild);
                    else 
                        message.channel.send({embeds: [embedMessage.setDescription(`👍 **${songInfo.title}** added to queue! 👍`)]});
                    return;
                }
            },

            'pause': () => {
                if (guildInfo) {
                    if (player.state.status === 'playing' && !guildInfo.pause) {
                        player.pause();
                        guildInfo.pause = true;
                        return message.channel.send({embeds: [embedMessage.setDescription(`✋ Song paused ✋`)]});
                    }
                }
            },
            
            'resume': () => {
                if (guildInfo) {
                    if (player.state.status === 'paused' && guildInfo.pause) {
                        player.unpause();
                        guildInfo.pause = false;
                        return message.channel.send({embeds: [embedMessage.setDescription(`▶️ Song resumed ▶️`)]});
                    }
                }
            },
            
            'stop': () => {
                if (guildInfo) {
                    player.stop();
                    return message.channel.send({embeds: [embedMessage.setDescription(`⛔ Song stoped ⛔`)]});
                }
            },
            
            'skip': () => {
                if (guildInfo && guildInfo.songs.length != 0) {
                    message.channel.send({embeds: [embedMessage.setDescription(`⏭️ Skipping song ⏭️`)]});
                    audio_player(message, guild);
                } else {
                    message.reply(`>>> 😥 There's no more songs 😥`);
                }
                return;
            },
            
            'playlist': () => {
                if (guildInfo) {
                    songsQueue = guildInfo.songs;
                    if (args.length != 0) {
                        const index = parseInt(args[0]);
                        if (Number.isInteger(index) && index <= songsQueue.length) {
                            for (let i = 0; i < index-1; i++) {
                                songsQueue.shift();
                            }
                            audio_player(message, guild);
                        } else {
                            message.reply({embeds: [embedMessage.setDescription(`🛑 Give a valid playlist position 🛑`)]});
                        }
                    }
                    if (songsQueue.length != 0) {
                        let text = "";
                        songsQueue.forEach((song, index) => {
                            text += `#${index+1} - ${song.title}\n`;
                        });
                        message.channel.send({embeds: [embedMessage.setDescription(`*_*_*_*_*_*_*_*_*_*_*_*_*__**Songs Queue**__*_*_*_*_*_*_*_*_*_*_*_*_* \n\n${text}`)]});
                    } else {
                        message.reply({embeds: [embedMessage.setDescription(`🙅 The song queue is empty 🙅`)]});
                    }
                }
                return;
            }
        }
        await PLAYER_CONTROL[cmd]();

        
        if (setEvents) {
            //Delete the guild info from the queue when the bot leaves the voice channel
            client.on('voiceStateUpdate', (oldState, newState) => {
                if (newState.id === client.application.id) {
                    if (newState.channelId === null) {
                        queue.delete(guild.id);
                    }
                }
                // return;
            });
            //Enter idle status when son finish and start next song
            queue.get(guild.id).player.on(AudioPlayerStatus.Idle, () => { 
                audio_player(message, guild);
                // return;
            });
            
            queue.get(guild.id).player.on('error', error => {
                console.error(error);
                // return;
            });
            setEvents = false;
        }
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
            message.channel.send({embeds: [embedMessage.setDescription(`Error finding the video.`)]});
        }
    }
}

const audio_player = async (message, guild) => {
    console.log("audio_player");
    const songsQueue = queue.get(guild.id).songs;
    if (songsQueue.length != 0) {
        const player = queue.get(guild.id).player;
        const song = songsQueue.shift();
        const stream = ytdl(song.url, {filter: 'audioonly'});
        const resource = createAudioResource(stream);
        player.play(resource);

        message.channel.send({embeds: [embedMessage.setDescription(`🎶 Now playing **${song.title}** 🎶`)]});
    }
}
