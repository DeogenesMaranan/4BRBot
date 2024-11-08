import { SlashCommandBuilder } from 'discord.js';

const message = `Attached here is our **CyberSec Command Bank**! This repository is a curated collection of essential commands, tips, and tools for anyone interested in cybersecurity, whether you're just starting out or already have experience. 

:link: **Check it out here:** [CyberSec Command Bank on GitHub](https://github.com/DeogenesMaranan/CyberSecCommandBank)`;

export const data = new SlashCommandBuilder()
	.setName('commandbank')
	.setDescription('Get the link to the CyberSec Command Bank');

export async function execute(interaction) {
	await interaction.reply({
		content: message,
		ephemeral: true 
	});
}
