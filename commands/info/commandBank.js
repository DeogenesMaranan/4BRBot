import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('commandbank')
	.setDescription('Get the link to the CyberSec Command Bank');

export async function execute(interaction) {
	await interaction.reply({
		content: 'https://github.com/DeogenesMaranan/CyberSecCommandBank',
		ephemeral: true 
	});
}
