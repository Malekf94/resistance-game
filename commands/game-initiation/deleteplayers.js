const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 5,
    data :new SlashCommandBuilder()
        .setName("deleteplayers")
        .setDescription("deletes players"),
    async execute(interaction){

        // await interaction.reply(`${interaction.user.username} has joined the game`)
    }
}