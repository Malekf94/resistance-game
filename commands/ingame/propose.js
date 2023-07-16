const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 5,
    data :new SlashCommandBuilder()
        .setName("propose")
        .setDescription("propose a list of players to go on a mission")
        .addStringOption(option =>
            option.setName("firstvote")
            .setDescription("first player to send on mission")
            .setRequired(true))
        .addStringOption(option =>
            option.setName("secondvote")
            .setDescription("second player to send on mission")
            .setRequired(true))
        .addStringOption(option =>
            option.setName("thirdvote")
            .setDescription("third player to send on mission")
            )
        .addStringOption(option =>
            option.setName("fourthvote")
            .setDescription("fourth player to send on mission")
            )
        .addStringOption(option =>
            option.setName("fifthvote")
            .setDescription("fifth player to send on mission")
            ),
    async execute(interaction){
    }
}