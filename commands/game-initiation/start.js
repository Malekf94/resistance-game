const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data :new SlashCommandBuilder()
        .setName("start")
        .setDescription("Begins the signing up stage for the game"),
    async execute(interaction){
       
    }
}