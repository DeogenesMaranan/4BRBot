import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

(async () => {
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = await import(`file://${filePath}`);
            const { data, execute, handleSelection } = command;

            if (data && execute) {
                client.commands.set(data.name, { execute, handleSelection });
                console.log(`Loaded command: ${data.name}`);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a "data" or "execute" property.`);
            }
        }
    }
})();

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
    } else if (interaction.isStringSelectMenu() && interaction.customId === "resource_select") {
        const selectedValue = interaction.values[0];
        const command = client.commands.get('mentoringresources');

        if (command && command.handleSelection) {
            try {
                await command.handleSelection(interaction, selectedValue);
            } catch (error) {
                console.error("Error handling selection:", error);
                await interaction.reply({
                    content: "There was an error processing your selection.",
                    ephemeral: true,
                });
            }
        } else {
            console.log("No handleSelection method found for command.");
        }
    }
});

client.login(TOKEN);
