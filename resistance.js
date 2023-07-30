const {Client, Events, GatewayIntentBits, Collection, SlashCommandBuilder} = require("discord.js")
const fs = require("node:fs")
const path = require("node:path")

const {token} = require("./config.json")

const client = new Client({intents:[GatewayIntentBits.Guilds]})

client.once(Events.ClientReady, () => {
	Players.sync();
	console.log(`Logged in as ${client.user.tag}!`);
});

let listOfPlayers = []
let noOfSpies = 0
let spies=[]
let resistance = []
let noVotesRequired = {
	5: [2,3,2,3,3],
	6: [2,3,4,3,4],
	7: [2,3,3,4,4],
	8: [3,4,4,5,5],
	9: [3,4,4,5,5],
	10: [3,4,4,5,5]
}
let gameInSession = false

let leader = []
let currentLeader = ""
let votess = []

let day = 1
let resistanceScore = 0
let spiesScore = 0
let noOfLeaderchanges = 0
let yesVotes = 0
let noVotes = 0
let missionVotes = 0
let failVotes = 0

function reset() {
	yesVotes=0
	noVotes=0
	missionVotes =0
	failVotes =0
}

function determineMission(totalNo, failNo, day){
	if (failNo==0) {
		return "success"
	}
	else if (failNo==1) {
		if(totalNo>=7&&day==4){
			return "success"
		}
		else return "fail"
	}
	else{
		return "fail"
	}
}


client.commands = new Collection()
client.cooldowns = new Collection()

// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
		} else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	const { cooldowns } = client;

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);	

	if (command.data.name === "join"){
		if (gameInSession) {
			return interaction.reply("Game has Started")
		}
		const playerName = interaction.member.nickname
		if(!listOfPlayers.includes(playerName)){
			listOfPlayers.push(playerName)
			interaction.reply(`${playerName} has joined the game`)
		}
		else{
			interaction.reply(`${playerName} is already in the game`)
		}
	}
	else if (command.data.name === 'begin') {
		if(listOfPlayers.length<5){
			return interaction.reply(`Not enough players`);
		}
		let shuffledList = listOfPlayers
   		 	.map(value => ({ value, sort: Math.random() }))
    		.sort((a, b) => a.sort - b.sort)
    		.map(({ value }) => value)
		

		noOfSpies=Math.ceil(listOfPlayers.length/3)
		noOfResistance=listOfPlayers.length-noOfSpies
		for(let i=0;i<noOfSpies;i++){
			spies.push(shuffledList[i])
		}
		for(let i=noOfSpies;i<shuffledList.length;i++){
			resistance.push(shuffledList[i])
		}
		leader.push(shuffledList[0])
		gameInSession = true
		interaction.reply(`Game has started. \nIt is day one,
		 ${shuffledList[0]} is the first leader for today.\n Type /propose to propose a team to go out on the first mission, after discussion, members can vote with /vote`)
	}
	else if (command.data.name === 'my_role') {
		if(!listOfPlayers.includes(interaction.member.nickname)){
			return interaction.reply("You are not in the game.")
		}
		let spiesString = `The spies are ${spies[0]}`
		for(let i=1;i<spies.length;i++){
			spiesString+=` and ${spies[i]}`
		}
		
		if(spies.includes(interaction.member.nickname)){
			// interaction.user.send(`You are a spy. ${spiesString}`)
			interaction.reply({ content: `You are a spy. ${spiesString}`, ephemeral: true })
		}
		else{
			// interaction.user.send("You are resistance")
			interaction.reply({ content: "You are resistance", ephemeral: true })
		}
		// interaction.reply("You have been sent your role")

	}
	else if (command.data.name === 'getplayers') {
		if(listOfPlayers.length===0){
			return interaction.reply("There are no players in the game")
		}
		else{
			let returnString = `The current players are ${listOfPlayers[0]}`
			for (let index = 1; index < listOfPlayers.length; index++) {
				returnString+= ` and ${listOfPlayers[index]}`
			}
		return interaction.reply(returnString);
		}
	}
	else if (command.data.name === 'start') {
		  noOfSpies = 0
		  spies=[]
		  resistance = []
		  noVotesRequired = {
			5: [2,3,2,3,3],
			6: [2,3,4,3,4],
			7: [2,3,3,4,4],
			8: [3,4,4,5,5],
			9: [3,4,4,5,5],
			10: [3,4,4,5,5]
		}
		  gameInSession = false

		  leader = []
		  currentLeader = ""
		  votess = []

		  day = 1
		  resistanceScore = 0
		  spiesScore = 0
		  noOfLeaderchanges = 0
		  yesVotes = 0
		  noVotes = 0
		  missionVotes = 0
		  failVotes = 0
		return interaction.reply('Game signup has started');
	}
	else if (command.data.name === 'propose') {
		// const playerName = interaction.options.getString('name');
		const playerName = interaction.member.nickname
		const groupOfPlayers = interaction.options._hoistedOptions
		if(playerName!=leader[leader.length-1]){
			return interaction.reply("You are not the current leader.")
		}
		let temp = (noVotesRequired[listOfPlayers.length][day-1])
		groupOfPlayers.forEach(element => {
			if(listOfPlayers.includes(element.value)&&!votess.includes(element.value)){
				votess.push(element.value)
			}
		});
		if(votess.length!=temp){
			votess = []

			return interaction.reply("You have proposed an incorrect number of people or people who aren't in the game.")
		}else{
			let output = `You have proposed the following to go on a mission: `
			votess.forEach(element => {
				output += `${element},`
			});
			return interaction.reply(output)
		}
	}
	else if (command.data.name === "numberofmissioneers"){
		if(listOfPlayers<5||listOfPlayers>10){
			return interaction.reply("incorrect number of players")
		}
		return interaction.reply(`The number of player required to go on a mission today is	${noVotesRequired[listOfPlayers.length][day-1]}`)
	}
	else if (command.data.name === 'yes') {
		if (votess.length==0) {
			return interaction.reply("No proposal has been made.")
		}
		yesVotes ++
		if (noVotes+yesVotes==listOfPlayers.length) {		
			if (noVotes>=yesVotes) {
				for (let index = 0; index < listOfPlayers.length; index++) {
					if (!leader.includes(listOfPlayers[i])) {
						return leader.push(listOfPlayers[i])
					}
				}
				let i= Math.floor(Math.random()* listOfPlayers.length)
				currentLeader= leader[leader.length-1]
				noOfLeaderchanges++
				if(noOfLeaderchanges==5){
					interaction.reply("Due to 5 leader changes. Spies have won the game")
				}else{
					reset()
					interaction.reply(`You have voted yes, since the majority didn't vote for the proposal, the leader has now been changed to ${currentLeader}`)
				}
			} else{
				let missioneers = `${interaction.member.nickname} has voted yes.
				The Majority have voted in favour of the proposal. ${votess[0]}`
				for (let index = 1; index < votess.length; index++) {
					missioneers+= ` and ${votess[index]}`
				}
				reset()
				noOfLeaderchanges = 0
				leader = []
				missioneers+= " will go on the mission. Mission goers type /decide_mission to choose whether to succeed or fail the mission"
				interaction.reply(missioneers)
			}
		}
		else{
			interaction.reply("Your vote has been registered")
		}
	}
	else if (command.data.name === 'no') {
		if (votess.length==0) {
			return interaction.reply("No proposal has been made.")
		}
		noVotes ++
		if(noVotes+yesVotes==listOfPlayers.length){
			if (noVotes>=yesVotes) {
				for (let index = 0; index < listOfPlayers.length; index++) {
					if (!leader.includes(listOfPlayers[i])) {
						return leader.push(listOfPlayers[i])
					}
				}
				let i= Math.floor(Math.random()* listOfPlayers.length)
				currentLeader= leader[leader.length-1]
				noOfLeaderchanges++
				if(noOfLeaderchanges==5){
					interaction.reply("Due to 5 leader changes. Spies have won the game")
				}else{
					reset()
					interaction.reply(`You have voted no, since the majority didn't vote for the proposal, the leader has now been changed to ${currentLeader}`)
				}
			} else{
				let missioneers = `${interaction.member.nickname} has voted no.
				The Majority have voted in favour of the proposal. ${votess[0]}`
				for (let index = 1; index < votess.length; index++) {
					missioneers+= ` and ${votess[index]}`
				}
				reset()
				noOfLeaderchanges = 0
				leader=[]
				missioneers+= " will go on the mission. Mission goers type /succeed to succeed the mission or /fail to fail the mission"
				interaction.reply(missioneers)
			}
		}
		else{
			interaction.reply("Your vote has been registered")
		}
	}
	else if (command.data.name === "decide_mission") {
		if (!votess.includes(interaction.member.nickname)) {
			return interaction.reply("You are not on the mission. Sit down fool and know your place.")
		}
		if (!spies.includes(interaction.member.nickname)&&interaction.options._hoistedOptions[0].value=="fail") {
			return interaction.user.send("You can't vote fail if you are resistance.")
		}
		else if (interaction.options._hoistedOptions[0].value=="fail") {
			failVotes ++
		}
		missionVotes ++

		interaction.user.send({ content: 'Your decision has been noted', ephemeral: true })
		
	}
	else if (command.data.name === "score") {
		interaction.reply(`Resistance score: ${resistanceScore}\nSpies score: ${spiesScore}`)
	}
	while (missionVotes==votess.length&&votess.length!=0) {
		let outcome = "na"
		let i= Math.floor(Math.random()* listOfPlayers.length)
		outcome = determineMission(listOfPlayers.length, failVotes, day)
		if(outcome=="success"){
			resistanceScore ++
			if (resistanceScore==3) {
			return interaction.reply("The votes have been tallied.\n The mission was a success.\nResistance have won the game")
			} 
			else{
				day++
				reset()
				leader.push(listOfPlayers[i])
				votess = []
				return interaction.reply(`The mission was a success.\nIt is day number ${day}.\n${leader[0]} is the first leader for the day. Type /propose to propose a mission group for today.`)	
			}
		} 
		else if (outcome=="fail"){
			spiesScore ++
			if (spiesScore==3) {
			return interaction.reply("The votes have been tallied.\n The mission was a failure.\nSpies have won the game")
			} else {
				day++
				reset()
				leader.push(listOfPlayers[i])
				votess = []
				return interaction.reply(`The mission was a failure.\nIt is day number ${day}.\n${leader[0]} is the first leader for the day. Type /propose to propose a mission group for today.`)
				}
			}
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token)