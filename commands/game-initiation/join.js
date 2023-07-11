const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 5,
    data :new SlashCommandBuilder()
        .setName("join")
        .setDescription("A new user has joined"),
    async execute(interaction){
        await interaction.reply(`${interaction.user.username} has joined the game`)
    }
}