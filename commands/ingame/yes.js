const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown:1,
    data :new SlashCommandBuilder()
        .setName("yes")
        .setDescription("Vote yes on the proposal"),
    async execute(interaction){
    }
}