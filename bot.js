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
let slot = [{hueman:'', role:'', note:'', index:20},
{hueman:'', role:'', note:'', index:20},
{hueman:'', role:'', note:'', index:20},
{hueman:'', role:'', note:'', index:20},
{hueman:'', role:'', note:'', index:20},
{hueman:'', role:'', note:'', index:20},
{hueman:'', role:'', note:'', index:20},
{hueman:'', role:'', note:'', index:20},
{hueman:'', role:'', note:'', index:20},
{hueman:'', role:'', note:'', index:20},
{hueman:'', role:'', note:'', index:20},
{hueman:'', role:'', note:'', index:20}];
let job;
let jobIndex;
let tempSlot;
let partyRosterString = '';
let roleCount = 0;
let slotCount = 0;
let waitReply = false;
let isPartyCreated = false;
let isRoleAvailable = false;
let personName;



/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready perfectly!');
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
		else if(name === 'at'){
			runName = 'Ancient Tower'
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
		message.channel.send("Party roster is full bishhhhhhh! :grimacing:");
	}
	else{
		job = name.toLowerCase();
		if(job === 'bio' || job === 'creator'){
			slot[roleCount].role = 'bio';
			slot[roleCount].index = 12;
		}
		else if(job === 'champ' || job === 'champion'){
			slot[roleCount].role = 'champ';
			slot[roleCount].index = 0;
		}
		else if(job === 'clown' || job === 'bard'){
			slot[roleCount].role = 'clown';
			slot[roleCount].index = 15;
		}
		else if(job === 'flex' || job === 'flexible' || job === 'any'){
			slot[roleCount].role = 'flex';
			slot[roleCount].index = 18;
		}
		else if(job === 'gs' || job === 'gunslinger' || job === 'slinger'){
			slot[roleCount].role = 'gs';
			slot[roleCount].index = 6;
		}
		else if(job === 'gypsy' || job === 'dancer'){
			slot[roleCount].role = 'gypsy';
			slot[roleCount].index = 16;
		}
		else if(job === 'hp' || job === 'priest'){
			slot[roleCount].role = 'hp';
			slot[roleCount].index = 2;
		}
		else if(job === 'hw' || job === 'hwiz' || job === 'wiz' || job === 'wizard'){
			slot[roleCount].role = 'hw';
			slot[roleCount].index = 3;
		}
		else if(job === 'lk' || job === 'knight'){
			slot[roleCount].role = 'lk';
			slot[roleCount].index = 7;
		}
		else if(job === 'ninja' || job === 'nin'){
			slot[roleCount].role = 'ninja';
			slot[roleCount].index = 5;
		}
		else if(job === 'pally' || job === 'paladin'){
			slot[roleCount].role = 'pally';
			slot[roleCount].index = 1;
		}
		else if(job === 'prof' || job === 'professor'){
			slot[roleCount].role = 'prof';
			slot[roleCount].index = 13;
		}
		else if(job === 'sg' || job === 'starglad'){
			slot[roleCount].role = 'sg';
			slot[roleCount].index = 10;
		}
		else if(job === 'sinx' || job === 'assassin'){
			slot[roleCount].role = 'sinx';
			slot[roleCount].index = 8;
		}
		else if(job === 'sl' || job === 'linker'){
			slot[roleCount].role = 'sl';
			slot[roleCount].index = 14;
		}
		else if(job === 'sniper' || job === 'snipe' || job === 'snip'){
			slot[roleCount].role = 'sniper';
			slot[roleCount].index = 4;
		}
		else if(job === 'stalker' || job === 'stalk'){
			slot[roleCount].role = 'stalker';
			slot[roleCount].index = 9;
		}
		else if(job === 'tk' || job === 'taekwon'){
			slot[roleCount].role = 'tk';
			slot[roleCount].index = 11;
		}
		else if(job === 'ws' || job === 'whitesmith'){
			slot[roleCount].role = 'ws';
			slot[roleCount].index = 17;
		}
		else{
			slot[roleCount].role = job;
			slot[roleCount].index = 19;
		}
		slot[roleCount].hueman = '';
		slot[roleCount].note = '';
		message.channel.send(":white_check_mark: " + slot[roleCount].role.toUpperCase() + " role has been added to the despair list. Muehuehuehue :japanese_goblin:");
		slot.sort(function(a, b){return a.index-b.index});
		roleCount++;
	}
  }
  else if (command === `${prefix}change`) {
	if(!person){
		personName = message.author.toString();
	}
	else{
		personName = content.slice(command.length + name.length + 2);
	}
	 if (personName.includes("<@!")){
		personName = personName.replace(/<@!/g,"<@");
	}
	if (isPartyCreated == false){
		message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
	}
	else if(!name){
		message.channel.send('Input the role you want to change to bishhhhhhh! :grimacing:\n```correct usage: !change [name of role] [name of person]```');
	}
	//else if(!hueman.includes(personName)){
	else if(!slot.some(e => e.hueman === personName)){
		message.channel.send(personName + " is not even in the parteh bishhhhhhh! :grimacing:");
	}
	else{
		job = name.toLowerCase();
		if(job === 'bio' || job === 'creator'){
			job = 'bio';
			jobIndex = 12;
		}
		else if(job === 'champ' || job === 'champion'){
			job = 'champ';
			jobIndex = 0;
		}
		else if(job === 'clown' || job === 'bard'){
			job = 'clown';
			jobIndex = 15;
		}
		else if(job === 'flex' || job === 'flexible' || job === 'any'){
			job = 'flex';
			jobIndex = 18;
		}
		else if(job === 'gs' || job === 'gunslinger' || job === 'slinger'){
			job = 'gs';
			jobIndex = 6;
		}
		else if(job === 'gypsy' || job === 'dancer'){
			job = 'gypsy';
			jobIndex = 16;
		}
		else if(job === 'hp' || job === 'priest'){
			job = 'hp';
			jobIndex = 2;
		}
		else if(job === 'hw' || job === 'hwiz' || job === 'wiz' || job === 'wizard'){
			job = 'hw';
			jobIndex = 3;
		}
		else if(job === 'lk' || job === 'knight'){
			job = 'lk';
			jobIndex = 7;
		}
		else if(job === 'ninja' || job === 'nin'){
			job = 'ninja';
			jobIndex = 5;
		}
		else if(job === 'pally' || job === 'paladin'){
			job = 'pally';
			jobIndex = 1;
		}
		else if(job === 'prof' || job === 'professor'){
			job = 'prof';
			jobIndex = 13;
		}
		else if(job === 'sg' || job === 'starglad'){
			job = 'sg';
			jobIndex = 10;
		}
		else if(job === 'sinx' || job === 'assassin'){
			job = 'sinx';
			jobIndex = 8;
		}
		else if(job === 'sl' || job === 'linker'){
			job = 'sl';
			jobIndex = 14;
		}
		else if(job === 'sniper' || job === 'snipe' || job === 'snip'){
			job = 'sniper';
			jobIndex = 4;
		}
		else if(job === 'stalker' || job === 'stalk'){
			job = 'stalker';
			jobIndex = 9;
		}
		else if(job === 'tk' || job === 'taekwon'){
			job = 'tk';
			jobIndex = 11;
		}
		else if(job === 'ws' || job === 'whitesmith'){
			job = 'ws';
			jobIndex = 17;
		}
		else{
			jobIndex = 19;
		}
		if(slot[slot.map(function(e) {return e.hueman}).indexOf(personName)].role === job){
			message.channel.send("It's the same job bishhhhhhh! :grimacing:");
		}
		else{
			isRoleAvailable = false;
			for(var x = 0; x<roleCount; x++){
				if(slot[x].role.toLowerCase() === job && slot[x].hueman === ''){
					jobIndex = slot.map(function(e) {return e.hueman}).indexOf(personName);
					slot[x].note = slot[jobIndex].note;
					slot[jobIndex].note = '';
					slot[jobIndex].hueman = '';
					slot[x].hueman = personName
					for(var y = jobIndex; y<(roleCount-1); y++){
						if(slot[y].role === slot[y+1].role && slot[y].hueman === ''){
							slot[y].hueman = slot[y+1].hueman;
							slot[y].note = slot[y+1].note;
							slot[y+1].hueman = '';
							slot[y+1].note = '';
						}
						else{
							break;
						}
					}
					isRoleAvailable = true;
					break;
				}
			}
			if(isRoleAvailable === false){
				slot[slot.map(function(e) {return e.hueman}).indexOf(personName)].role = job;
				slot[slot.map(function(e) {return e.hueman}).indexOf(personName)].index = jobIndex;
			}
			message.channel.send(":white_check_mark: Changed " + personName + "'s role to " + job.toUpperCase() + ".");
			slot.sort(function(a, b){return a.index-b.index});
		}
	}
  }
  else if (command === `${prefix}remove`) {
	if (isPartyCreated == false){
		message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
	}
	else if(!name){
		message.channel.send('Input the role you want to remove bishhhhhhh! :grimacing:\n```correct usage: !remove [name of role]```');
	}
	else if(!slot.some(e => e.role === name.toLowerCase())){
		message.channel.send('There is no such role in the parteh bishhhhhhh! :grimacing:');
	}
	else{
		if(slot[slot.map(function(e) {return e.role}).lastIndexOf(name.toLowerCase())].hueman === ''){
			message.channel.send(":white_check_mark: " + name.toUpperCase() + " role has been removed. Muehuehuehuehue :japanese_goblin:");
		}
		else{
			message.channel.send(":white_check_mark: " + name.toUpperCase() + " role has been removed together with " + slot[slot.map(function(e) {return e.role}).lastIndexOf(name.toLowerCase())].hueman + ". Muehuehuehuehue :japanese_goblin:");
			slotCount--;
		}
		slot.splice(slot.map(function(e) {return e.role}).lastIndexOf(name.toLowerCase()), 1);
		roleCount--;
		slot[11] = {hueman:'', role:'', note:'', index:20};
	}
  }
  else if (command === `${prefix}join`) {
	if (isPartyCreated == false){
		message.channel.send('Nothing to join to bishhhhhhh! :grimacing:');
	}
	else if(slotCount >= roleCount){
		message.channel.send("Party roster is full bishhhhhhh! :grimacing:");
	}
	else if(slot.some(e => e.hueman === message.author.toString())){
		message.channel.send('You already joined bishhhhhhh! :grimacing:');
	}
	else if(!name){
		message.channel.send('Input the role you want to join bishhhhhhh! :grimacing:\n```correct usage: !join [name of role]```');
	}
	else{
		isRoleAvailable = false;
		for(var x = 0; x<roleCount; x++){
			if(slot[x].role.toLowerCase() === name.toLowerCase() && slot[x].hueman === ''){
				slot[x].hueman = message.author.toString();
				slotCount++;
				isRoleAvailable = true;
				message.channel.send(":white_check_mark: " + slot[x].hueman + " joined as " + slot[x].role.toUpperCase() + ".");
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
	else if(!name || !slot.some(e => e.role === name.toLowerCase())){
		message.channel.send('Input the role you want to join bishhhhhhh! :grimacing:\n```correct usage: !invite [name of role] [name of person]```');
	}
	//else if(slot.some(e => e.role === name.toLowerCase())==false && slot[role.lastIndexOf(name.toLowerCase())] == ''){
		//message.channel.send('Role is not available bishhhhhhh! :grimacing:');
	//}
	else if(!person){
		message.channel.send('Input the name of the hueman you want to invite bishhhhhhh! :grimacing:\n```correct usage: !invite [name of role] [name of person]```');
	}
	else if(slotCount >= roleCount){
		message.channel.send("Party roster is full bishhhhhhh! :grimacing:");
	}
	else{
		personName = content.slice(command.length + name.length + 2);
		if (personName.includes("<@!")){
			personName = personName.replace(/<@!/g,"<@");
		}
		if(slot.some(e => e.hueman === personName) === false){
			//if(hueman[role.lastIndexOf(name.toLowerCase())] == ''){
			//}
			isRoleAvailable = false;
			for(var x = 0; x<roleCount; x++){
				if(slot[x].role.toLowerCase() === name.toLowerCase() && slot[x].hueman === ''){
					slot[x].hueman = personName;
					slotCount++;
					isRoleAvailable = true;
					message.channel.send(":white_check_mark: Invited " + slot[x].hueman + " to join as " + slot[x].role.toUpperCase() + ".");
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
		if(slot.some(e => e.hueman === message.author.toString()) === false){
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
						slot[slot.map(function(e) {return e.hueman}).indexOf(message.author.toString())].note = '';
						slot[slot.map(function(e) {return e.hueman}).indexOf(message.author.toString())].hueman = '';
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
	else if(!slot.some(e => e.hueman === message.author.toString())){
		message.channel.send("You're not even in the parteh bishhhhhhh! :grimacing:");
	}
	else if(!name){
		if(slot[slot.map(function(e) {return e.hueman}).indexOf(message.author.toString())].note === ''){
			message.channel.send("Your note is blank bishhhhhhh! :grimacing:\n```correct usage: !note [your message here]```");
		}
		else{
			slot[slot.map(function(e) {return e.hueman}).indexOf(message.author.toString())].note = '';
			message.channel.send(":negative_squared_cross_mark: The note has been shamelessly removed muehuehuehuehue :japanese_goblin:");
		}
	}
	else{
		slot[slot.map(function(e) {return e.hueman}).indexOf(message.author.toString())].note = " (" + content.slice(6) + ")";
		message.channel.send(":white_check_mark: The note has been shamelessly added muehuehuehuehue :japanese_goblin:");
	}
  }
  else if (command === `${prefix}kick`) {
	personName = content.slice(command.length + 1);
	if (personName.includes("<@!")){
		personName = name.replace(/<@!/g,"<@");
	}
	if (isPartyCreated == false){
		message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
	}
	else if(!name){
		message.channel.send("Input a name bishhhhhhh! :grimacing:\n```correct usage: !kick [name of person]```");
	}
	else if(slot.some(e => e.hueman === personName) === false){
		message.channel.send(personName + " is not even in the parteh bishhhhhhh! :grimacing:");
	}
	else{
		slot[slot.map(function(e) {return e.hueman}).indexOf(personName)].note = '';
		slot[slot.map(function(e) {return e.hueman}).indexOf(personName)].hueman = '';
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
		slot = [{hueman:'', role:'champ', note:'', index:0},
		{hueman:'', role:'pally', note:'', index:1},
		{hueman:'', role:'hp', note:'', index:2},
		{hueman:'', role:'hp', note:'', index:2},
		{hueman:'', role:'hw', note:'', index:3},
		{hueman:'', role:'sniper', note:'', index:4},
		{hueman:'', role:'sniper', note:'', index:4},
		{hueman:'', role:'bio', note:'', index:12},
		{hueman:'', role:'flex', note:'', index:18},
		{hueman:'', role:'flex', note:'', index:18},
		{hueman:'', role:'flex', note:'', index:18},
		{hueman:'', role:'flex', note:'', index:18}];
		message.channel.send(":white_check_mark: George has setup the party roster cuz " + organizer + " is too lazeh :japanese_goblin:");
		for(var x = 0; x < 12; x++){
			if(slot[x].role===''){
				partyRosterString = partyRosterString.concat(":free: (Free)\n");
			}
			else{
				if(slot[x].role==='bio'){
					partyRosterString = partyRosterString.concat(":moneybag: Bio: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='champ'){
					partyRosterString = partyRosterString.concat(":punch: Champ: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='clown'){
					partyRosterString = partyRosterString.concat(":guitar: Clown: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='flex'){
					partyRosterString = partyRosterString.concat(":star: Flex: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='gs'){
					partyRosterString = partyRosterString.concat(":gun: GS: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='gypsy'){
					partyRosterString = partyRosterString.concat(":dancer: Gypsy: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='hp'){
					partyRosterString = partyRosterString.concat(":syringe: HP: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='hw'){
					partyRosterString = partyRosterString.concat(":sparkles: HW: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='lk'){
					partyRosterString = partyRosterString.concat(":crossed_swords: LK: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='ninja'){
					partyRosterString = partyRosterString.concat(":chopsticks: Ninja: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='pally'){
					partyRosterString = partyRosterString.concat(":shield: Pally: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='prof'){
					partyRosterString = partyRosterString.concat(":book: Prof: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='sg'){
					partyRosterString = partyRosterString.concat(":star: SG: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='sinx'){
					partyRosterString = partyRosterString.concat(":knife: SinX: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='sl'){
					partyRosterString = partyRosterString.concat(":link: SL: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='sniper'){
					partyRosterString = partyRosterString.concat(":bow_and_arrow: Sniper: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='stalker'){
					partyRosterString = partyRosterString.concat(":spy: Stalker: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='tk'){
					partyRosterString = partyRosterString.concat(":martial_arts_uniform: TK: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='ws'){
					partyRosterString = partyRosterString.concat(":hammer: WS: " + slot[x].hueman + slot[x].note + "\n");
				}
				else{
					partyRosterString = partyRosterString.concat(":bust_in_silhouette: " + slot[x].role + ":" + slot[x].hueman + slot[x].note + "\n");
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
					for(x=0; x<roleCount; x++){
						slot[x].hueman = '';
						slot[x].note = '';
					}
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
			if(slot[x].hueman.length > 0){
				partyRosterString = partyRosterString.concat(slot[x].hueman + ' ');
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
			//console.log(slot[x]);
			if(slot[x].role===''){
				partyRosterString = partyRosterString.concat(":free: (Free)\n");
			}
			else{
				if(slot[x].role==='bio'){
					partyRosterString = partyRosterString.concat(":moneybag: Bio: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='champ'){
					partyRosterString = partyRosterString.concat(":punch: Champ: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='clown'){
					partyRosterString = partyRosterString.concat(":guitar: Clown: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='flex'){
					partyRosterString = partyRosterString.concat(":star: Flex: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='gs'){
					partyRosterString = partyRosterString.concat(":gun: GS: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='gypsy'){
					partyRosterString = partyRosterString.concat(":dancer: Gypsy: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='hp'){
					partyRosterString = partyRosterString.concat(":syringe: HP: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='hw'){
					partyRosterString = partyRosterString.concat(":sparkles: HW: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='lk'){
					partyRosterString = partyRosterString.concat(":crossed_swords: LK: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='ninja'){
					partyRosterString = partyRosterString.concat(":chopsticks: Ninja: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='pally'){
					partyRosterString = partyRosterString.concat(":shield: Pally: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='prof'){
					partyRosterString = partyRosterString.concat(":book: Prof: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='sg'){
					partyRosterString = partyRosterString.concat(":star: SG: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='sinx'){
					partyRosterString = partyRosterString.concat(":knife: SinX: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='sl'){
					partyRosterString = partyRosterString.concat(":link: SL: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='sniper'){
					partyRosterString = partyRosterString.concat(":bow_and_arrow: Sniper: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='stalker'){
					partyRosterString = partyRosterString.concat(":spy: Stalker: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='tk'){
					partyRosterString = partyRosterString.concat(":martial_arts_uniform: TK: " + slot[x].hueman + slot[x].note + "\n");
				}
				else if(slot[x].role==='ws'){
					partyRosterString = partyRosterString.concat(":hammer: WS: " + slot[x].hueman + slot[x].note + "\n");
				}
				else{
					partyRosterString = partyRosterString.concat(":bust_in_silhouette: " + slot[x].role + ":" + slot[x].hueman + slot[x].note + "\n");
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
					slot = [{hueman:'', role:'', note:'', index:20},
					{hueman:'', role:'', note:'', index:20},
					{hueman:'', role:'', note:'', index:20},
					{hueman:'', role:'', note:'', index:20},
					{hueman:'', role:'', note:'', index:20},
					{hueman:'', role:'', note:'', index:20},
					{hueman:'', role:'', note:'', index:20},
					{hueman:'', role:'', note:'', index:20},
					{hueman:'', role:'', note:'', index:20},
					{hueman:'', role:'', note:'', index:20},
					{hueman:'', role:'', note:'', index:20},
					{hueman:'', role:'', note:'', index:20}];
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
			partehTime.setHours(parseInt(setTime[0], 10)-2);
			partehTime.setMinutes(parseInt(setTime[1], 10));
			timeMsg = (partehTime.getMonth() + 1) + "/" + partehTime.getDate() + "/" + partehTime.getFullYear() + " "
			if(partehTime.getHours()<9){
			  timeMsg = timeMsg + "0"
			}
			timeMsg = timeMsg + (partehTime.getHours()+2) + ":"
			if(partehTime.getMinutes()<10){
			  timeMsg = timeMsg + "0"
			}
			timeMsg = timeMsg + partehTime.getMinutes() + " GMT+2 (tRO Server Time)"
			message.channel.send(
			  ":white_check_mark: Countdown to total despair has been set muehuehuehuehue :japanese_goblin:\nParteh time: " +
			    timeMsg
			);

			partehTime.setMinutes(parseInt(setTime[1], 10) - partehTime.getTimezoneOffset());
			currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
			partehTime.setDate(partehTime.getDate() + (partehTime < currentTime));
			var diffTime = (partehTime - currentTime) / 60000;
			var partehHour = Math.trunc(diffTime / 60);
			var partehMinute = diffTime % 60;
		}
	}
  } else if (command.startsWith(prefix)) {
    message.channel.send("Bishhhhhhhh! Wat da heck is dat command!? :japanese_goblin:\n```Type !help for command list```");
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);
