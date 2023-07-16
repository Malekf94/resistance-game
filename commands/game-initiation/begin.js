const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data :new SlashCommandBuilder()
        .setName("begin")
        .setDescription("Game starts"),
    async execute(interaction){
    }
}