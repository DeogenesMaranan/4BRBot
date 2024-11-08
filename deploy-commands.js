import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Retrieve environment variables
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Array to store commands
const commands = [];

// Read command files
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
	const folderPath = path.join(commandsPath, folder);
	const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(folderPath, file);
		const command = await import(`file://${filePath}`);
		if (command.data && command.execute) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a "data" or "execute" property.`);
		}
	}
}

// Create a REST instance and set the token
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		// Deploy commands
		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands }
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
