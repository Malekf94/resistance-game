const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 5,
    data :new SlashCommandBuilder()
        .setName("decide_mission")
        .setDescription("decide mission outcome")
        .addStringOption(option =>
            option.setName("mission_outcome")
            .setDescription("choose success or failure")
            .addChoices(
                {name:"fail", value:"fail"},
                {name:"success", value:"success"}
            )
            .setRequired(true)),
    async execute(interaction){
    }
}