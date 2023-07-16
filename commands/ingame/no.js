const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown:60,
    data :new SlashCommandBuilder()
        .setName("no")
        .setDescription("Vote no on the proposal"),
    async execute(interaction){

    }
}