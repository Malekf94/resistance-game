
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data :new SlashCommandBuilder()
        .setName("help")
        .setDescription("Helps you understand how to play"),
    async execute(interaction){
        interaction.reply(`
        /rules:- explains the rules of the game
        /join:- to join the game
        /begin:- Starts the game and assigns everyone roles
        /my_role:- sends you a message informing you whether you are spies or resistance
        /propose:- When you are the leader, you propose a number of players to "go" on a mission
        /yes:- Whether you are happy for the proposed team to go ahead
        /no:- Whether you don't want the proposed team to go ahead
        /numberofmissioneers:- Informs you of the number of players required for today's mission
        /score:- Informs you of the score for both teams
        /getplayers:- Informs you the names of the players who are in the game.`)
    }
}
