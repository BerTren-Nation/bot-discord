const Discord = require('discord.js');

const { prefix, TOKEN } = require('./config.json');

const fs = require('fs');

const client = new Discord.Client({

	presence: {		status: 'online',

		activity: {

			name: `${prefix}help for more info!`,

			type: 'LISTENING'

		}

	},

	partials: ['GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'],

	ws: {

		properties: {

			$browser: 'Realme RMX1941',

			$device: 'MT6762V/WR (8) @ 2.001GHz',

			$os: 'Android 9 aarch64'

		}

	}

});

client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();

client.prefix = prefix;

const diri = [

    "General",

    "Anime",

    "Private",

    "Music"

]

diri.forEach(async (res) => {

    const commandFiles = fs.readdirSync(`./commands/${res}`).filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {

        const command = require(`./commands/${res}/${file}`)

        client.commands.set(command.name, command)

    }

})

client.login(TOKEN).catch(() => { console.log('Invaid TOKEN!') });

client.once('ready', async () => {

    console.log(`Ready!, login as ${client.user.username}`)})

client.on('warn', info => console.log(info));

client.on('error', console.error);

client.on('message', async message => {

    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);

    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (command) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', command, 'args :', args.length)

    if (!command) return;

    if (!cooldowns.has(command.name)) {

        cooldowns.set(command.name, new Discord.Collection());

    }

    const now = Date.now();

    const timestamps = cooldowns.get(command.name);

    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {

        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {

            const timeLeft = (expirationTime - now) / 1000;

            return (await message.reply(`Please wait ${timeLeft.toFixed(1)} second(s) until next command!`))

            .then(msg => msg.delete({timeout: 2000}));

        }

    }

    timestamps.set(message.author.id, now);

    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

try {

    command.execute(client, message, args)

} catch (error) {

	console.error(error);

	message.reply('there was an error trying to execute that command!');

}

});
