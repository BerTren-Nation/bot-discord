const { MessageEmbed } = require('discord.js');
require('./play')

module.exports = {
	name: 'stop',
	description: 'Stop Play Music',
	async execute(client, message, args) {
		music.destroy();
		setTimeout(voiceChannel.leave(), 3000);
	}
}