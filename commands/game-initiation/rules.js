
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data :new SlashCommandBuilder()
        .setName("rules")
        .setDescription("Outlines the rules of the game"),
    async execute(interaction){
        interaction.reply(`The setup:-
        1- Number of players needs to be between 5 and 10
        2- One third of the players, rounded up are spies, the rest are Resistance
        3- The spies know who each other are, but they aren't allowed to communicate
        
        The game:-
        1- Every day a mission leader is chosen
        2- The mission leader choses the number of people to go out on a mission
        3- Everyone discusses the leader's choice and in the end simultaneously vote in public whether to go ahead with the mission or not
        4- If the majority vote no or it's a tie then the leadership passes on to the next person
        5- This keeps on going until a majority has been reached
        6- After 5 rejected proposals the spies win
        
        The mission:- 
        1- The players "go" on a mission
        2- The players on a mission have to submit a secret vote to fail or succeed the mission
        3- Resistance players have to submit a vote to succeed
        4- Spies can either choose to succeed (to keep identity secret) or fail (risk revealing themselves)
        5- The game master reveals the votes, if there's a fail vote (or two in mission 4 if there's more than 6 players), then spies get a point, otherwise the Resistance get a point
        
        Game ends when either side has 3 points
        
        Number of players per mission
        Day 1-2-3-4-5
        No. of players are 5 :- 2,3,2,3,3
        No. of players are 6 :- 2,3,4,3,4
        No. of players are 7 :- 2,3,3,4,4
        No. of players are 8 :- 3,4,4,5,5
        No. of players are 9 :- 3,4,4,5,5
        No. of players are 10 :- 3,4,4,5,5`)
    }
}
