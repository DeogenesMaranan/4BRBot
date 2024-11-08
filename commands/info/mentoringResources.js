import {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("mentoringresources")
    .setDescription("Provides a selection of mentoring resources");

export async function execute(interaction) {
    try {
        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("resource_select")
                .setPlaceholder("Choose a resource")
                .addOptions([
                    {
                        label: "Linux Fundamentals",
                        value: "linux_fundamentals",
                        description: "Learn the basics of Linux",
                    },
                    {
                        label: "Note Taking",
                        value: "note_taking",
                        description: "Tips for effective note taking",
                    },
                ]),
        );

        await interaction.reply({
            content: "Select a mentoring resource:",
            components: [row],
            ephemeral: true,
        });
    } catch (error) {
        console.error("Error executing mentoringresources command:", error);
        await interaction.reply({
            content: "There was an error displaying the mentoring resources menu.",
            ephemeral: true,
        });
    }
}

export async function handleSelection(interaction, selectedValue) {
    console.log("Handling selection:", selectedValue);
    try {
        if (selectedValue === "linux_fundamentals") {
            await interaction.update({
                content: "You selected Linux Fundamentals! Here's a guide to get started.",
                components: [],
            });
        } else if (selectedValue === "note_taking") {
            await interaction.update({
                content: "You selected Note Taking! Here are some effective strategies.",
                components: [],
            });
        } else {
            await interaction.update({
                content: "Invalid selection.",
                components: [],
            });
        }
    } catch (error) {
        console.error("Error handling selection:", error);
        await interaction.reply({
            content: "There was an error processing your selection.",
            ephemeral: true,
        });
    }
}
