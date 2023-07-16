const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data :new SlashCommandBuilder()
        .setName("numberofmissioneers")
        .setDescription("tells you the number of player required for the mission"),
    async execute(interaction){
    }
}