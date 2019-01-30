/**
 * An example of how you can send embeds
 */

// Extract the required classes from the discord.js module
const { Discord, MessageCollector, Client, RichEmbed } = require('discord.js');
const botSetting = require("./auth.json")

// Create an instance of a Discord client
const client = new Client();

const prefix = botSetting.prefix;

var runName = '';
var orgMsg = '';
var organizer;
var person;
var hueman = ['', '', '', '', '', '', '', '', '', '', '', ''];
var role = ['', '', '', '', '', '', '', '', '', '', '', ''];
var partyRosterString = '';
var roleCount = 0;
var slotCount = 0;
var isPartyCreated = false;
var isRoleAvailable = false;
//var isDisbandChoice = false;
//var isDitchChoice = false;
var ditchSlot;

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', async message => {
var content = message.content;
var parts = content.split(" ");
var command = parts[0];
var name = parts[1];
var person = parts[2];
	if(message.channel.type === "dm") return;
	if(!command.startsWith(prefix)) return;
	
  if (command === `${prefix}create`) {
	if(isPartyCreated == true){
		message.channel.send("There's already a run bishhhhhhhhh! :grimacing:");
	}
	else{
		isPartyCreated = true;
		if (name === 'et'){
			runName = 'Endless Tower'
		}
		else if(name === 'gmc'){
			runName = 'Game Master Challenge'
		}
		else if(name === 'wave'){
			runName = 'Wave Challenge'
		}
		else if(!name){//typeof name === 'undefined'){
			message.channel.send('Name ze run bishhhhhhhhhh! :grimacing:');
			isPartyCreated = false;
		}
		else{
			runName = content.slice(8);
		}
		if(isPartyCreated === true){
			organizer = message.author.toString();
			orgMsg = 'Organized by ' + organizer + ' :grimacing:\n\n';
			var partyRosterString = '';
			for(var x = 0; x<12; x++){
				partyRosterString = partyRosterString.concat(':free: (Free)\n');
			}
			// We can create embeds using the MessageEmbed constructor
			// Read more about all that you can do with the constructor
			// over at https://discord.js.org/#/docs/main/stable/class/RichEmbed
			const embed = new RichEmbed()
			  // Set the title of the field
			  .setTitle("Strange Despair's " + runName)
			  // Set the color of the embed
			  .setColor(0xFF0000)
			  // Set the main content of the embed
			  .setDescription(orgMsg + partyRosterString)
			  .setFooter('Parteh Members: ' + slotCount + ' / ' + roleCount);
			// Send the embed to the same channel as the message
			message.channel.send(embed);
		}
	}
  }
  else if (command === `${prefix}add`) {
	if (isPartyCreated == false){
		message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
	}
	else{
		role[roleCount]=name.toLowerCase();
	if(role[roleCount] === 'sniper' || role[roleCount] === 'snip'){
			role[roleCount] = 'sniper';
		}
		else if(role[roleCount] === 'bio' || role[roleCount] === 'creator'){
			role[roleCount] = 'bio';
		}
		else if(role[roleCount] === 'hp' || role[roleCount] === 'priest'){
			role[roleCount] = 'hp';
		}
		else if(role[roleCount] === 'hw' || role[roleCount] === 'wiz' || role[roleCount] === 'wizard'){
			role[roleCount] = 'hw';
		}
		else if(role[roleCount] === 'pally' || role[roleCount] === 'paladin'){
			role[roleCount] = 'pally';
		}
		else if(role[roleCount] === 'champ' || role[roleCount] === 'champion'){
			role[roleCount] = 'champ';
		}
		else if(role[roleCount] === 'ws' || role[roleCount] === 'whitesmith'){
			role[roleCount] = 'ws';
		}
		else{
			role[roleCount] = name.charAt(0).toUpperCase() + name.slice(1);
		}
		message.channel.send(":white_check_mark: " + role[roleCount].toUpperCase() + " role has been added to the despair list. Muehuehuehue :japanese_goblin:");
		roleCount++;
	}
  }
  else if (command === `${prefix}remove`) {
	if (isPartyCreated == false){
		message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
	}
	else if(!name){
		message.channel.send('Input the role you want to remove bishhhhhhh! :grimacing:');
	}
	else if(role.includes(name.toLowerCase())==false){
		message.channel.send('There is no such role in the parteh bishhhhhhh! :grimacing:');
	}
	else{
		if(hueman[role.lastIndexOf(name.toLowerCase())] == ''){
			message.channel.send(":white_check_mark: " + name.toUpperCase() + " role has been removed. Muehuehuehuehue :japanese_goblin:");
		}
		else{
			message.channel.send(":white_check_mark: " + name.toUpperCase() + " role has been removed together with " + hueman[role.lastIndexOf(name.toLowerCase())] + ". Muehuehuehuehue :japanese_goblin:");
			slotCount--;
		}
		hueman.splice(role.lastIndexOf(name.toLowerCase()), 1);
		hueman[11] = '';
		role.splice(role.lastIndexOf(name.toLowerCase()), 1);
		roleCount--;
		role[11] = '';
	}
  }
  else if (command === `${prefix}join`) {
	if (isPartyCreated == false){
		message.channel.send('Nothing to join to bishhhhhhh! :grimacing:');
	}
	else if(hueman.includes(message.author.toString()) == true){
		message.channel.send('You already joined bishhhhhhh! :grimacing:');
	}
	else if(!name){
		message.channel.send('Input the role you want to join bishhhhhhh! :grimacing:');
	}
	else{
		for(var x = 0; x<roleCount; x++){
			if(role[x].toLowerCase() === name.toLowerCase() && hueman[x] === ''){
				//console.log('Before: ' + hueman.indexOf(message.author.toString()));
				hueman[x] = message.author.toString();
				//console.log('After: ' + hueman.indexOf(message.author.toString()));
				slotCount++;
				isRoleAvailable = true;
				message.channel.send(":white_check_mark: " + hueman[x] + " joined as " + role[x].toUpperCase() + ".");
				break;
			}
		}
		if(isRoleAvailable === false){
			message.channel.send('Role is not available bishhhhhhh! :grimacing:');
		}
	}
  }
  else if (command === `${prefix}invite`) {
	if (isPartyCreated == false){
		message.channel.send('No parteh exist yet bishhhhhhh! :grimacing:');
	}
	else if(!name){
		message.channel.send('Input the role you want to join bishhhhhhh! :grimacing:');
	}
	else if(role.includes(name.toLowerCase())==false && hueman[role.lastIndexOf(name.toLowerCase())] == ''){
		message.channel.send('Role is not available bishhhhhhh! :grimacing:');
	}
	else if(!person){
		message.channel.send('Input the name of the hueman you want to invite bishhhhhhh! :grimacing:');
	}
	else{
		if(hueman.includes(person) === false){
			if(hueman[role.lastIndexOf(name.toLowerCase())] == ''){
			}
			for(var x = 0; x<roleCount; x++){
				if(role[x].toLowerCase() === name.toLowerCase() && hueman[x] === ''){
					//console.log('Before: ' + hueman.indexOf(message.author.toString()));
					hueman[x] = person;
					//console.log('After: ' + hueman.indexOf(message.author.toString()));
					slotCount++;
					isRoleAvailable = true;
					message.channel.send(":white_check_mark: Invited " + hueman[x] + " to join as " + role[x].toUpperCase() + ".");
					break;
				}
			}
			if(isRoleAvailable === false){
				message.channel.send('Role is not available bishhhhhhh! :grimacing:');
			}
		}
		else{
			message.channel.send(person + ' already joined this parteh bishhhhhhh! :grimacing:');
		}
	}
  }
  else if (command === `${prefix}ditch`) {
	if (isPartyCreated === false){
		message.channel.send('Nothing to ditch from bishhhhhhh! :grimacing:');
	}
	else{
		//for(var x = 0; x<roleCount; x++){
			
		//}
		if(hueman.includes(message.author.toString()) === false){
			message.channel.send("You're not even in the list bishhhhhhh! :grimacing:");
		}
		else{
			message.channel.send('NOOOOOoooooooooOOOOOOO\nDo you really want to ditch us!?\n(type y if yes.)');
			const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 5000 });
			collector.on('collect', replyMsg => {
				if (replyMsg.content === "y") {
					hueman[hueman.indexOf(message.author.toString())] = '';
					slotCount--;
					message.channel.send(":negative_squared_cross_mark: A shameless person has ditched the parteh. :grimacing:");
				}
				else{
					message.channel.send("I'll take that as a NO then. :kissing:");
				}
			})
		}
	}
  }
  else if (command === `${prefix}view`) {
	if (isPartyCreated == false){
		message.channel.send('Nothing to view bishhhhhhh! :grimacing:');
	}
	else if(isPartyCreated == true){
		partyRosterString = '';
		for(var x = 0; x < 12; x++){
			if(role[x]===''){
				partyRosterString = partyRosterString.concat(":free: (Free)\n");
			}
			else{
				if(role[x]==='hp'){
					partyRosterString = partyRosterString.concat(":syringe: HP: " + hueman[x] + "\n");
				}
				else if(role[x]==='hw'){
					partyRosterString = partyRosterString.concat(":sparkles: HW: " + hueman[x] + "\n");
				}
				else if(role[x]==='bio'){
					partyRosterString = partyRosterString.concat(":moneybag: Bio: " + hueman[x] + "\n");
				}
				else if(role[x]==='ws'){
					partyRosterString = partyRosterString.concat(":hammer: WS: " + hueman[x] + "\n");
				}
				else if(role[x]==='pally'){
					partyRosterString = partyRosterString.concat(":poultry_leg: Pally: " + hueman[x] + "\n");
				}
				else if(role[x]==='champ'){
					partyRosterString = partyRosterString.concat(":shield: Champ: " + hueman[x] + "\n");
				}
				else if(role[x]==='sniper'){
					partyRosterString = partyRosterString.concat(":bow_and_arrow: Sniper: " + hueman[x] + "\n");
				}
				else{
					partyRosterString = partyRosterString.concat(":bust_in_silhouette: " + role[x] + ": " + hueman[x] + "\n");
				}
			}
		}
		const embed = new RichEmbed()
		  .setTitle("Strange Despair's " + runName)
		  .setColor(0xFF0000)
		  .setDescription(orgMsg + partyRosterString)
		  .setFooter('Parteh Members: ' + slotCount + ' / ' + roleCount);
		message.channel.send(embed);
	}
  }
  else if (command === `${prefix}disband`) {
	if (isPartyCreated == false){
		message.channel.send('Nothing to disband bishhhhhhh! :grimacing:');
	}
	else if(organizer != message.author.toString()){
		message.channel.send('Only the organizer ' + organizer + ' can disband the parteh of despair! muehuehuehuehuehue :japanese_goblin:');
	}
	else{
		message.channel.send('NOOOOOoooooooooOOOOOOO\nDo you really want to disband the parteh!?\n(type y if yes.)');
		const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 5000 });
        collector.on('collect', replyMsg => {
            if (replyMsg.content === "y") {
                runName = '';
				roleCount = 0;
				slotCount = 0;
				isPartyCreated = false;
				hueman = ['', '', '', '', '', '', '', '', '', '', '', ''];
				role = ['', '', '', '', '', '', '', '', '', '', '', ''];
				message.channel.send(":negative_squared_cross_mark: The parteh has now been devoured deep within the abyssal void. :grimacing:");
            }
			else{
                message.channel.send("I'll take that as a NO then. :kissing:");
            }
		})
	}
  }
  else if (command === `${prefix}time`) {
	if (isPartyCreated == false){
		message.channel.send('Nothing to set time to bishhhhhhh! :grimacing:');
	}
  }
  //else if (command === prefix + 'prefix') {
	//prefix = parts[1];
	//message.channel.send('Changed prefix to ' + prefix);
  //}
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);
