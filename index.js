import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import express from 'express';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

// Express web server
const app = express();
app.get('/', (req, res) => res.send('Bot is running'));
app.listen(3000, () => console.log('Server is up!'));

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Discord client
const TOKEN = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load Commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

(async () => {
	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = await import(`file://${filePath}`); // Use file:// scheme for ESM

			if (command.data && command.execute) {
				client.commands.set(command.data.name, command);
				console.log(`Loaded command: ${command.data.name}`);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a "data" or "execute" property.`);
			}
		}
	}
})();

// Event Listeners
client.once(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	} else if (interaction.isStringSelectMenu()) {
		const selectedValue = interaction.values[0];

		if (selectedValue === 'linux_fundamentals') {
			await interaction.update({
				content: 'You selected Linux Fundamentals! Here’s a guide to get started.',
				components: [],
			});
		} else if (selectedValue === 'note_taking') {
			await interaction.update({
				content: 'You selected Note Taking! Here are some effective strategies.',
				components: [],
			});
		}
	}
});

// Login to Discord
client.login(TOKEN);
