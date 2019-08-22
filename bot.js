// Extract the required classes from the discord.js module
const { Discord, MessageCollector, Client, RichEmbed } = require('discord.js');
const botSetting = require("./auth.json")

// Create an instance of a Discord client
const client = new Client();

const prefix = botSetting.prefix;
const helpMsg = botSetting.help;

let runName = '';
let orgMsg = '';
let timeMsg = '';
let info = '';
let setTime;
let partehTime;
let organizer;
let hueman = ['', '', '', '', '', '', '', '', '', '', '', ''];
let role = ['', '', '', '', '', '', '', '', '', '', '', ''];
let note = ['', '', '', '', '', '', '', '', '', '', '', ''];
let partyRosterString = '';
let roleCount = 0;
let slotCount = 0;
let waitReply = false;
let isPartyCreated = false;
let isRoleAvailable = false;
let personName;
let ditchSlot;



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
var command = parts[0].toLowerCase();
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
		else if(name === 'garden'){
			runName = 'Elysian Garden'
		}
		else if(!name){
			message.channel.send('Name ze run bishhhhhhhhhh! :grimacing:\n```correct usage: !create [name of parteh]```');
			isPartyCreated = false;
		}
		else{
			runName = content.slice(8);
		}
		if(isPartyCreated === true){
			organizer = message.author.toString();
			orgMsg = 'Organized by ' + organizer + ' :grimacing:\n\n';
			partyRosterString = '';
			for(var x = 0; x<12; x++){
				partyRosterString = partyRosterString.concat(':free: (Free)\n');
			}
			const embed = new RichEmbed()
			  .setTitle("Strange Despair's " + runName)
			  .setColor(0xFF0000)
			  .setDescription(orgMsg + partyRosterString + "\n")
			  .setFooter('Parteh Members: ' + slotCount + ' / ' + roleCount);
			message.channel.send(embed);
		}
	}
  }
  else if (command === `${prefix}add`) {
	if (isPartyCreated == false){
		message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
	}
	else if(!name){
		message.channel.send("Input the role you want to add bishhhhhhh! :grimacing:\n```correct usage: !add [name of role]```");
	}
	else if(roleCount >= 12){
		message.channel.send("Party roster is full bish bishhhhhhh! :grimacing:");
	}
	else{
		role[roleCount]=name.toLowerCase();
		if(role[roleCount] === 'bio' || role[roleCount] === 'creator'){
			role[roleCount] = 'bio';
		}
		else if(role[roleCount] === 'champ' || role[roleCount] === 'champion'){
			role[roleCount] = 'champ';
		}
		else if(role[roleCount] === 'clown' || role[roleCount] === 'bard'){
			role[roleCount] = 'clown';
		}
		else if(role[roleCount] === 'flex' || role[roleCount] === 'flexible' || role[roleCount] === 'any'){
			role[roleCount] = 'flex';
		}
		else if(role[roleCount] === 'gs' || role[roleCount] === 'gunslinger' || role[roleCount] === 'slinger'){
			role[roleCount] = 'gs';
		}
		else if(role[roleCount] === 'gypsy' || role[roleCount] === 'dancer'){
			role[roleCount] = 'gypsy';
		}
		else if(role[roleCount] === 'hp' || role[roleCount] === 'priest'){
			role[roleCount] = 'hp';
		}
		else if(role[roleCount] === 'hw' || role[roleCount] === 'wiz' || role[roleCount] === 'wizard'){
			role[roleCount] = 'hw';
		}
		else if(role[roleCount] === 'lk' || role[roleCount] === 'knight'){
			role[roleCount] = 'lk';
		}
		else if(role[roleCount] === 'pally' || role[roleCount] === 'paladin'){
			role[roleCount] = 'pally';
		}
		else if(role[roleCount] === 'prof' || role[roleCount] === 'professor'){
			role[roleCount] = 'prof';
		}
		else if(role[roleCount] === 'sg' || role[roleCount] === 'starglad'){
			role[roleCount] = 'sg';
		}
		else if(role[roleCount] === 'sinx' || role[roleCount] === 'assassin'){
			role[roleCount] = 'sinx';
		}
		else if(role[roleCount] === 'sl' || role[roleCount] === 'linker'){
			role[roleCount] = 'sl';
		}
		else if(role[roleCount] === 'sniper' || role[roleCount] === 'snipe' || role[roleCount] === 'snip'){
			role[roleCount] = 'sniper';
		}
		else if(role[roleCount] === 'stalker' || role[roleCount] === 'stalk'){
			role[roleCount] = 'stalker';
		}
		else if(role[roleCount] === 'tk' || role[roleCount] === 'taekwon'){
			role[roleCount] = 'tk';
		}
		else if(role[roleCount] === 'ws' || role[roleCount] === 'whitesmith'){
			role[roleCount] = 'ws';
		}
		else{
			role[roleCount] = name.toLowerCase();
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
		message.channel.send('Input the role you want to remove bishhhhhhh! :grimacing:\n```correct usage: !remove [name of role]```');
	}
	else if(!role.includes(name.toLowerCase())){
		message.channel.send('There is no such role in the parteh bishhhhhhh! :grimacing:');
	}
	else{
		if(hueman[role.lastIndexOf(name.toLowerCase())] == ''){
			message.channel.send(":white_check_mark: " + name.toUpperCase() + " role has been removed. Muehuehuehuehue :japanese_goblin:");
		}
		else{
			message.channel.send(":white_check_mark: " + name.toUpperCase() + " role has been removed together with " + hueman[role.lastIndexOf(name.toLowerCase())] + ". Muehuehuehuehue :japanese_goblin:");
			note[hueman[role.lastIndexOf(name.toLowerCase())]] = '';
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
	else if(slotCount >= roleCount){
		message.channel.send("Party roster is full bish bishhhhhhh! :grimacing:");
	}
	else if(hueman.includes(message.author.toString()) == true){
		message.channel.send('You already joined bishhhhhhh! :grimacing:');
	}
	else if(!name){
		message.channel.send('Input the role you want to join bishhhhhhh! :grimacing:\n```correct usage: !join [name of role]```');
	}
	else{
		for(var x = 0; x<roleCount; x++){
			if(role[x].toLowerCase() === name.toLowerCase() && hueman[x] === ''){
				hueman[x] = message.author.toString();
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
		message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
	}
	else if(!name || !role.includes(name.toLowerCase())){
		message.channel.send('Input the role you want to join bishhhhhhh! :grimacing:\n```correct usage: !invite [name of role] [name of person]```');
	}
	else if(role.includes(name.toLowerCase())==false && hueman[role.lastIndexOf(name.toLowerCase())] == ''){
		message.channel.send('Role is not available bishhhhhhh! :grimacing:');
	}
	else if(!person){
		message.channel.send('Input the name of the hueman you want to invite bishhhhhhh! :grimacing:\n```correct usage: !invite [name of role] [name of person]```');
	}
	else if(slotCount >= roleCount){
		message.channel.send("Party roster is full bish bishhhhhhh! :grimacing:");
	}
	else{
		personName = content.slice(command.length + name.length + 2);
		if(hueman.includes(personName) === false){
			if(hueman[role.lastIndexOf(name.toLowerCase())] == ''){
			}
			for(var x = 0; x<roleCount; x++){
				if(role[x].toLowerCase() === name.toLowerCase() && hueman[x] === ''){
					hueman[x] = personName;
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
		if(hueman.includes(message.author.toString()) === false){
			message.channel.send("You're not even in the list bishhhhhhh! :grimacing:");
		}
		else{
			message.channel.send('NOOOOOoooooooooOOOOOOO\nDo you really want to ditch us!?\n(type y if yes.)');
			waitReply = true;
			const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 8000 });
			collector.on('collect', replyMsg => {
				if (waitReply === true){
					waitReply = false;
					if (replyMsg.content.toLowerCase() === "y") {
						note[hueman.indexOf(message.author.toString())] = '';
						hueman[hueman.indexOf(message.author.toString())] = '';
						slotCount--;
						message.channel.send(":negative_squared_cross_mark: A shameless person has ditched the parteh. :grimacing:");
					}
					else{
						message.channel.send("I'll take that as a NO then. :kissing:");
					}
				}
			})
		}
	}
  }
  else if (command === `${prefix}note`) {
	if (isPartyCreated == false){
		message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
	}
	else if(!hueman.includes(message.author.toString())){
		message.channel.send("You're not even in the parteh bishhhhhhh! :grimacing:");
	}
	else if(!name){
		if(note[hueman.indexOf(message.author.toString())] === ''){
			message.channel.send("Your note is blank bishhhhhhh! :grimacing:\n```correct usage: !note [your message here]```");
		}
		else{
			note[hueman.indexOf(message.author.toString())] = '';
			message.channel.send(":negative_squared_cross_mark: The note has been shamelessly removed muehuehuehuehue :japanese_goblin:");
		}
	}
	else{
		note[hueman.indexOf(message.author.toString())] = " (" + content.slice(6) + ")";
		message.channel.send(":white_check_mark: The note has been shamelessly added muehuehuehuehue :japanese_goblin:");
	}
  }
  else if (command === `${prefix}kick`) {
	personName = content.slice(command.length + 1);
	if (isPartyCreated == false){
		message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
	}
	else if(!name){
		message.channel.send("Input a name bishhhhhhh! :grimacing:\n```correct usage: !kick [name of person]```");
	}
	else if(!hueman.includes(personName)){
		message.channel.send(personName + " is not even in the parteh bishhhhhhh! :grimacing:");
	}
	else{
		note[hueman.indexOf(name)] = '';
		hueman[hueman.indexOf(name)] = '';
		slotCount--;
		message.channel.send(":negative_squared_cross_mark: "+personName+" has been shamelessly kicked hard out of the parteh muehuehuehuehue :japanese_goblin:");
	}
  }
  else if (command === `${prefix}info`) {
	if (isPartyCreated == false){
		message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
	}
	else if(organizer != message.author.toString()){
		message.channel.send('Only the organizer ' + organizer + ' can put info in the parteh of despair! muehuehuehuehuehue :japanese_goblin:');
	}
	else if(!name){
		if(info === ''){
			message.channel.send("Your info is blank bishhhhhhh! :grimacing:\n```correct usage: !info [your message here]```");
		}
		else{
			info = '';
			message.channel.send(":negative_squared_cross_mark: Additional information for the parteh has been shamelessly removed muehuehuehuehue :japanese_goblin:");
		}
	}
	else{
		info = "\n" + content.slice(6);
		message.channel.send(":white_check_mark: Additional information for the parteh has been shamelessly added muehuehuehuehue :japanese_goblin:");
	}
  }
  else if (command === `${prefix}party`) {
	if(organizer != message.author.toString()){
		message.channel.send('Only the organizer ' + organizer + ' can use this command of despair! muehuehuehuehuehue :japanese_goblin:');
	}
	if (name == 'default'){
		partyRosterString = '';
		roleCount = 12;
		slotCount = 0;
		hueman = ['', '', '', '', '', '', '', '', '', '', '', ''];
		role = ['champ', 'pally', 'hw', 'hp', 'hp', 'sniper', 'sniper', 'bio', 'flex', 'flex', 'flex', 'flex'];
		note = ['', '', '', '', '', '', '', '', '', '', '', ''];
		message.channel.send(":white_check_mark: George has setup the party roster cuz " + organizer + " is too lazeh :japanese_goblin:");
		for(var x = 0; x < 12; x++){
			if(role[x]===''){
				partyRosterString = partyRosterString.concat(":free: (Free)\n");
			}
			else{
				if(role[x]==='bio'){
					partyRosterString = partyRosterString.concat(":moneybag: Bio: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='champ'){
					partyRosterString = partyRosterString.concat(":punch: Champ: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='clown'){
					partyRosterString = partyRosterString.concat(":guitar: Clown: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='flex'){
					partyRosterString = partyRosterString.concat(":star: Flex: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='gs'){
					partyRosterString = partyRosterString.concat(":gun: GS: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='gypsy'){
					partyRosterString = partyRosterString.concat(":bikini: Gypsy: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='hp'){
					partyRosterString = partyRosterString.concat(":syringe: HP: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='hw'){
					partyRosterString = partyRosterString.concat(":sparkles: HW: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='lk'){
					partyRosterString = partyRosterString.concat(":crossed_swords: LK: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='pally'){
					partyRosterString = partyRosterString.concat(":shield: Pally: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='prof'){
					partyRosterString = partyRosterString.concat(":book: Prof: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='sg'){
					partyRosterString = partyRosterString.concat(":star: SG: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='sinx'){
					partyRosterString = partyRosterString.concat(":knife: SinX: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='sl'){
					partyRosterString = partyRosterString.concat(":link: SL: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='sniper'){
					partyRosterString = partyRosterString.concat(":bow_and_arrow: Sniper: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='stalker'){
					partyRosterString = partyRosterString.concat(":spy: Stalker: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='tk'){
					partyRosterString = partyRosterString.concat(":martial_arts_uniform: TK: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='ws'){
					partyRosterString = partyRosterString.concat(":hammer: WS: " + hueman[x] + note[x] + "\n");
				}
				else{
					partyRosterString = partyRosterString.concat(":bust_in_silhouette: " + role[x] + ": " + hueman[x] + note[x] + "\n");
				}
			}
		}
		if(partehTime){
			var currentTime = new Date();
			currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
			var diffTime = (partehTime - currentTime) / 60000;
			var partehHour = Math.trunc(diffTime / 60);
			var partehMinute = Math.round(diffTime % 60);
			if(partehTime >= currentTime){
				timeMsg = "(" + partehHour + " hours " + partehMinute + " minutes before the start of despair)";
			}
			else{
				timeMsg = "(ongoing despair muehuehuehuehue :japanese_goblin:)";
			}
		}
		const embed = new RichEmbed()
		  .setTitle("Strange Despair's " + runName + " " + timeMsg)
		  .setColor(0xFF0000)
		  .setDescription(orgMsg + partyRosterString + "\n" + info)
		  .setFooter('Parteh Members: ' + slotCount + ' / ' + roleCount);
		message.channel.send(embed);
	}
	else if (name == 'wipe'){
		message.channel.send('NOOOOOoooooooooOOOOOOO\nDo you really want to wipe the parteh roster!?\n(type y if yes.)');
		waitReply = true;
		const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 8000 });
        collector.on('collect', replyMsg => {
			if (waitReply === true){
				waitReply = false;
				if (replyMsg.content.toLowerCase() === "y") {
					roleCount = 0;
					slotCount = 0;
					hueman = ['', '', '', '', '', '', '', '', '', '', '', ''];
					role = ['', '', '', '', '', '', '', '', '', '', '', ''];
					note = ['', '', '', '', '', '', '', '', '', '', '', ''];
					message.channel.send(":negative_squared_cross_mark: The parteh roster has now been wiped clean. :grimacing:");
					const embed = new RichEmbed()
					  .setTitle("Strange Despair's " + runName + " " + timeMsg)
					  .setColor(0xFF0000)
					  .setDescription(orgMsg + partyRosterString + "\n" + info)
					  .setFooter('Parteh Members: ' + slotCount + ' / ' + roleCount);
					message.channel.send(embed);
				}
				else{
					message.channel.send("I'll take that as a NO then. :kissing:");
				}
			}
		})
	}
	else{
		message.channel.send("Wrong command bishhhhhhh! :grimacing:\n```correct usage: !party default\n!party wipe```");
	}
  }
  else if (command === `${prefix}poke` || command === `${prefix}summon` || command === `${prefix}tag`) {
	if(isPartyCreated === false){
		message.channel.send("There's no party roster yet bishhhhhhh!! :grimacing:");
	}
	else{
		partyRosterString = '';
		for(var x = 0; x<12; x++){
			if(hueman[x].length > 0){
				partyRosterString = partyRosterString.concat(hueman[x] + ' ');
			}
		}
		if(partyRosterString.length > 0){
			message.channel.send(":white_check_mark: I activate my spell card to special summon " + partyRosterString + "in attack position!");
		}
		else{
			message.channel.send("There's no huemans in the party roster bishhhhhhh!! :grimacing:");
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
				if(role[x]==='bio'){
					partyRosterString = partyRosterString.concat(":moneybag: Bio: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='champ'){
					partyRosterString = partyRosterString.concat(":punch: Champ: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='clown'){
					partyRosterString = partyRosterString.concat(":guitar: Clown: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='flex'){
					partyRosterString = partyRosterString.concat(":star: Flex: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='gs'){
					partyRosterString = partyRosterString.concat(":gun: GS: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='gypsy'){
					partyRosterString = partyRosterString.concat(":bikini: Gypsy: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='hp'){
					partyRosterString = partyRosterString.concat(":syringe: HP: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='hw'){
					partyRosterString = partyRosterString.concat(":sparkles: HW: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='lk'){
					partyRosterString = partyRosterString.concat(":crossed_swords: LK: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='pally'){
					partyRosterString = partyRosterString.concat(":shield: Pally: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='prof'){
					partyRosterString = partyRosterString.concat(":book: Prof: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='sg'){
					partyRosterString = partyRosterString.concat(":star: SG: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='sinx'){
					partyRosterString = partyRosterString.concat(":knife: SinX: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='sl'){
					partyRosterString = partyRosterString.concat(":link: SL: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='sniper'){
					partyRosterString = partyRosterString.concat(":bow_and_arrow: Sniper: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='stalker'){
					partyRosterString = partyRosterString.concat(":spy: Stalker: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='tk'){
					partyRosterString = partyRosterString.concat(":martial_arts_uniform: TK: " + hueman[x] + note[x] + "\n");
				}
				else if(role[x]==='ws'){
					partyRosterString = partyRosterString.concat(":hammer: WS: " + hueman[x] + note[x] + "\n");
				}
				else{
					partyRosterString = partyRosterString.concat(":bust_in_silhouette: " + role[x] + ": " + hueman[x] + note[x] + "\n");
				}
			}
		}
		if(partehTime){
			var currentTime = new Date();
			currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
			var diffTime = (partehTime - currentTime) / 60000;
			var partehHour = Math.trunc(diffTime / 60);
			var partehMinute = Math.round(diffTime % 60);
			if(partehTime >= currentTime){
				timeMsg = "(" + partehHour + " hours " + partehMinute + " minutes before the start of despair)";
			}
			else{
				timeMsg = "(ongoing despair muehuehuehuehue :japanese_goblin:)";
			}
		}
		const embed = new RichEmbed()
		  .setTitle("Strange Despair's " + runName + " " + timeMsg)
		  .setColor(0xFF0000)
		  .setDescription(orgMsg + partyRosterString + "\n" + info)
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
		waitReply = true;
		const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 8000 });
        collector.on('collect', replyMsg => {
			if (waitReply === true){
				waitReply = false;
				if (replyMsg.content.toLowerCase() === "y") {
					partehTime = '';
					runName = '';
					info = '';
					roleCount = 0;
					slotCount = 0;
					isPartyCreated = false;
					hueman = ['', '', '', '', '', '', '', '', '', '', '', ''];
					role = ['', '', '', '', '', '', '', '', '', '', '', ''];
					note = ['', '', '', '', '', '', '', '', '', '', '', ''];
					message.channel.send(":negative_squared_cross_mark: The parteh has now been devoured deep within the abyssal void. :grimacing:");
				}
				else{
					message.channel.send("I'll take that as a NO then. :kissing:");
				}
			}
		})
	}
  }
  else if (command === `${prefix}help`|| command === `${prefix}halp`) {
	  message.author.send("George Bot for dummies:");
	  message.author.send(helpMsg);
	  message.channel.send("Psst " + message.author.toString() + "... I have secretly sent noods to you via PM muehuehuehue :japanese_goblin:");
  }
  else if (command === `${prefix}time`) {
	if (isPartyCreated == false){
		message.channel.send('Nothing to set time to bishhhhhhh! :grimacing:');
	}
	else if(organizer != message.author.toString()){
		message.channel.send('Only the organizer ' + organizer + ' can set the time of despair! muehuehuehuehuehue :japanese_goblin:');
	}
	else if (!name){
		message.channel.send('Set a time for the parteh bishhhhhhh! :grimacing:');
	}
	else if(!name.includes(":") || name.length !== 5){
		message.channel.send('Set a proper time bishhhhhhh! :grimacing:\n```usage: !time hh:mm```');
	}
	else{
		setTime = name.split(":");
		if(isNaN(parseInt(setTime[0])) || isNaN(parseInt(setTime[1]))){
			message.channel.send('Set a proper time bishhhhhhh! :grimacing:\n```correct usage: !time hh:mm```');
		}
		else{
			var currentTime = new Date();
			partehTime = new Date();
			partehTime.setHours(parseInt(setTime[0],10));
			partehTime.setMinutes(parseInt(setTime[1],10));
			message.channel.send(":white_check_mark: Countdown to total despair has been set muehuehuehuehue :japanese_goblin:\nParteh time: " + partehTime);
			
			partehTime.setMinutes(parseInt(setTime[1],10) - partehTime.getTimezoneOffset());
			currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
			partehTime.setDate(partehTime.getDate() + (partehTime < currentTime));
			var diffTime = (partehTime - currentTime) / 60000;
			var partehHour = Math.trunc(diffTime / 60);
			var partehMinute = diffTime % 60;
		}
	}
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);
