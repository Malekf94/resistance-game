const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data :new SlashCommandBuilder()
        .setName("join")
        .setDescription("A new user has joined"),
    async execute(interaction){
    }
}