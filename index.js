const {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	MessageFlags,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

const client = new Client({ intents: [
	GatewayIntentBits.Guilds , 
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
] });



module.exports = client;

client.commands = new Collection();

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.log(`No matching command found`);
		return;
	}

	try {
		await command.execute(interaction);

	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "There was an error while executing this command!",
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

const messageCreateHandler = require('./events/Message');
client.on(messageCreateHandler.name, (...args) => messageCreateHandler.execute(...args));

const messageCount = require('./events/MessageCount');
client.on(messageCount.name , (...args) => messageCount.execute(...args) )

const wishes = require('./crons/Wishes')
client.once('ready' , () => {
	wishes(client)
})



client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
