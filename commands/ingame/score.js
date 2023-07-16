const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data :new SlashCommandBuilder()
        .setName("score")
        .setDescription("Gives the score for both teams"),
    async execute(interaction){
    }
}