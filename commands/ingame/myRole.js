const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data :new SlashCommandBuilder()
        .setName("my_role")
        .setDescription("informs a player of their role"),
    async execute(interaction){

        // await interaction.reply(`${interaction.user.username} has joined the game`)
    }
}