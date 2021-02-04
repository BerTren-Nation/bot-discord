const { MessageEmbed } = require('discord.js');
const ytdl = require("ytdl-core");

module.exports = {
	name: 'play',
	description: 'play music',
	async execute(client, message, args) {
		voiceChannel = message.member.voice.channel;
		if (!voiceChannel){
		message.channel.send('You need to be in a voice channel to play music!')
		} else {
			const permissions = voiceChannel.permissionsFor(message.client.user);
			if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send("I need the permissions to join and speak in your voice channel!");
			voiceChannel.join().then(connection => {
				async function Erlangga() {
				const songInfo= await ytdl.getInfo(args[0])
				message.channel.send(`\nPlay Music ${songInfo.videoDetails.title}\nRequest by ${message.author.tag}`)
				const stream = ytdl(args[0], {filter:"audioonly", quality:"highestaudio"})
				music = connection.play(stream, {seek:0, volume:1})
				music.on("end", end => {
					voiceChannel.leave()
					})
					}
Erlangga()
				})
			}
	}
}