// Extract the required classes from the discord.js module
const { Discord, MessageCollector, Client, RichEmbed } = require('discord.js');
const botSetting = require("./auth.json");
//const keepAlive = require('./server');

// Firebase
const admin = require("firebase-admin");
let firebase = require("./firebase.json");
admin.initializeApp({
	credential: admin.credential.cert(firebase),
  databaseURL: "https://kuraido-bots.firebaseio.com"
});
let db = admin.firestore();

// Create an instance of a Discord client
const client = new Client();

const prefix = botSetting.prefix;
const helpMsg = botSetting.help;


let runName = '';
let orgMsg = '';
let timeMsg = '';
let info = '';
let setTime;
let partehTime = null;
let organizer;
let slot = [];
let job;
let jobIndex;
let oldIndex;
let newIndex;
let tempSlot;
let partyRosterString = '';
let roleCount = 0;
let slotCount = 0;
let waitReply = false;
let isPartyCreated = false;
let isRoleAvailable = false;
let personName;

const colorEmbed = 0xFF0000;
const georgeState = db.collection("george-main").doc("state");
const georgeRoster = db.collection("george-roster");

// Place values from firestore database to variable for easier handling
georgeState.get().then((q) => {
	runName = q.data().rosterName,
	organizer = q.data().organizer,
	info = q.data().rosterInfo,
	roleCount = q.data().roleCount,
	slotCount = q.data().slotCount,
	isPartyCreated = q.data().isPartyCreated;
	if(q.data().partyHour > 0 || q.data().partyMinute > 0){
		partehTime = new Date();
		partehTime.setHours(parseInt(q.data().partyHour, 10)-2);
		partehTime.setMinutes(parseInt(q.data().partyMinute, 10));
		timeMsg = (partehTime.getMonth() + 1) + "/" + partehTime.getDate() + "/" + partehTime.getFullYear() + " ";
		if(partehTime.getHours()<9){
		  timeMsg = timeMsg + "0";
		}
		timeMsg = timeMsg + (partehTime.getHours()+2) + ":";
		if(partehTime.getMinutes()<10){
		  timeMsg = timeMsg + "0";
		}
		timeMsg = timeMsg + partehTime.getMinutes() + " GMT+2 (tRO Server Time)";
	}
}).catch(err =>{
  console.log("Sam Ting Wong with George State initial variables",err);
});
georgeRoster.orderBy('index').get().then((snapshot) => {
	snapshot.docs.forEach(doc =>{
		slot.push({
			hueman: doc.data().name,
			role: doc.data().role,
			note: doc.data().note,
			index: doc.data().index
		});
		if(doc.id == "slot-11"){
			slot.sort(function(a, b){return a.index-b.index});
		}
	});
}).catch(err =>{
	console.log("Sam Ting Wong in slot variable",err);
});

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */

client.on("ready", () => {
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
	
	if(command === `${prefix}create`) {
		if(isPartyCreated === true){
			message.channel.send("There's already a run bishhhhhhhhh! :grimacing:");
		}
		else{
			isPartyCreated = true;
			if (name === 'et'){
				runName = 'Endless Tower';
			} else if(name === 'at'){
				runName = 'Ancient Tower';
			} else if(name === 'gmc'){
				runName = 'Game Master Challenge';
			} else if(name === 'wave'){
				runName = 'Wave Challenge';
			} else if(name === 'garden'){
				runName = 'Elysian Garden';
			} else if(!name){
				message.channel.send('Name ze run bishhhhhhhhhh! :grimacing:\n```correct usage: !create [name of parteh]```');
				isPartyCreated = false;
			} else {
				runName = content.slice(8);
			}
			if(isPartyCreated === true){
				organizer = message.author.toString();
				georgeState.update({
					isPartyCreated: true,
					organizer: organizer,
					rosterName: runName
				});
				orgMsg = 'Organized by ' + organizer + ' :grimacing:\n\n';
				partyRosterString = '';
				for(var x = 0; x<12; x++){
					partyRosterString = partyRosterString.concat(':free: (Free)\n');
				}
				const embed = new RichEmbed()
				  .setTitle("Strange Despair's " + runName)
				  .setColor(colorEmbed)
				  .setDescription(orgMsg + partyRosterString + "\n")
				  .setFooter('Parteh Members: ' + slotCount + ' / ' + roleCount);
				message.channel.send(embed);
			}
		}
	} else if (command === `${prefix}add`) {
		if (isPartyCreated == false){
			message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
		} else if(!name){
			message.channel.send("Input the role you want to add bishhhhhhh! :grimacing:\n```correct usage: !add [name of role]```");
		} else if(roleCount >= 12){
      if(slotCount < 12){
        message.channel.send("Can't add anymore roles bishhhhhhh! :grimacing:\n```Use !join [class] or !invite [class] [name of hueman] to join the party```");
      } else {
			  message.channel.send("Party roster is full bishhhhhhh! :grimacing:");
      }
		} else {
			job = name.toLowerCase();
			if(job === 'asura' || job === 'sura'){
				job = 'asura';
				jobIndex = 21*12;
			} else if(job === 'bio' || job === 'creator'){
				job = 'bio';
				jobIndex = 13*12;
			} else if(job === 'champ' || job === 'champion'){
				job = 'champ';
				jobIndex = 1*12;
			} else if(job === 'clown' || job === 'bard'){
				job = 'clown';
				jobIndex = 16*12;
			} else if(job === 'flex' || job === 'flexible' || job === 'any'){
				job = 'flex';
				jobIndex = 19*12;
			} else if(job === 'gs' || job === 'gunslinger' || job === 'slinger'){
				job = 'gs';
				jobIndex = 7*12;
			} else if(job === 'gypsy' || job === 'dancer'){
				job = 'gypsy';
				jobIndex = 17*12;
			} else if(job === 'hp' || job === 'priest'){
				job = 'hp';
				jobIndex = 3*12;
			} else if(job === 'hw' || job === 'hwiz' || job === 'wiz' || job === 'wizard'){
				job = 'hw';
				jobIndex = 4*12;
			} else if(job === 'lk' || job === 'knight'){
				job = 'lk';
				jobIndex = 8*12;
			} else if(job === 'ninja' || job === 'nin'){
				job = 'ninja';
				jobIndex = 6*12;
			} else if(job === 'pally' || job === 'paladin'){
				job = 'pally';
				jobIndex = 2*12;
			} else if(job === 'prof' || job === 'professor'){
				job = 'prof';
				jobIndex = 14*12;
			} else if(job === 'sg' || job === 'starglad'){
				job = 'sg';
				jobIndex = 11*12;
			} else if(job === 'sinx' || job === 'assassin'){
				job = 'sinx';
				jobIndex = 9*12;
			} else if(job === 'sl' || job === 'linker'){
				job = 'sl';
				jobIndex = 15*12;
			} else if(job === 'sn' || job === 'super' || job === 'novice'){
				job = 'sn'
				jobIndex = 20*12;
			} else if(job === 'sniper' || job === 'snipe' || job === 'snip'){
				job = 'sniper';
				jobIndex = 5*12;
			} else if(job === 'stalker' || job === 'stalk'){
				job = 'stalker';
				jobIndex = 10*12;
			} else if(job === 'tk' || job === 'taekwon'){
				job = 'tk';
				jobIndex = 12*12;
			} else if(job === 'ws' || job === 'whitesmith'){
				job = 'ws';
				jobIndex = 18*12;
			} else {
				jobIndex = 22*12;
			}
			slot[roleCount].role = job;
			slot[roleCount].index = jobIndex;
			slot[roleCount].hueman = '';
			slot[roleCount].note = '';
			georgeRoster.where("role","==","").limit(1).get().then(snapshot =>{
				snapshot.forEach(doc => {
					georgeRoster.doc(doc.id).update({
						role: job,
						index: jobIndex
					});
				});
			}).catch(err =>{
        console.log("Sam Ting Wong with adding roles",err);
      });
			message.channel.send(":white_check_mark: " + job.toUpperCase() + " role has been added to the despair list. Muehuehuehue :japanese_goblin:");
      console.log("Before Sort:");
      console.log(slot);
			slot.sort(function(a, b){return a.index-b.index});
      console.log("After Sort:");
      console.log(slot);
			roleCount++;
			georgeState.update({
				roleCount: roleCount
			});
		}
	} else if (command === `${prefix}change`) {
		if(!person){
			personName = message.author.toString();
		} else {
			personName = content.slice(command.length + name.length + 2);
		}
		if (personName.includes("<@!")){
			personName = personName.replace(/<@!/g,"<@");
		}
		if (isPartyCreated == false){
			message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
		} else if(!name){
			message.channel.send('Input the role you want to change to bishhhhhhh! :grimacing:\n```correct usage: !change [name of role] [name of person]```');
		} else if(!slot.some(e => e.hueman === personName)){
			message.channel.send(personName + " is not even in the parteh bishhhhhhh! :grimacing:");
		} else {
			job = name.toLowerCase();
			if(job === 'asura' || job === 'sura'){
				job = 'asura';
				jobIndex = 21*12;
			} else if(job === 'bio' || job === 'creator'){
				job = 'bio';
				jobIndex = 13*12;
			} else if(job === 'champ' || job === 'champion'){
				job = 'champ';
				jobIndex = 1*12;
			} else if(job === 'clown' || job === 'bard'){
				job = 'clown';
				jobIndex = 16*12;
			} else if(job === 'flex' || job === 'flexible' || job === 'any'){
				job = 'flex';
				jobIndex = 19*12;
			} else if(job === 'gs' || job === 'gunslinger' || job === 'slinger'){
				job = 'gs';
				jobIndex = 7*12;
			} else if(job === 'gypsy' || job === 'dancer'){
				job = 'gypsy';
				jobIndex = 17*12;
			} else if(job === 'hp' || job === 'priest'){
				job = 'hp';
				jobIndex = 3*12;
			} else if(job === 'hw' || job === 'hwiz' || job === 'wiz' || job === 'wizard'){
				job = 'hw';
				jobIndex = 4*12;
			} else if(job === 'lk' || job === 'knight'){
				job = 'lk';
				jobIndex = 8*12;
			} else if(job === 'ninja' || job === 'nin'){
				job = 'ninja';
				jobIndex = 6*12;
			} else if(job === 'pally' || job === 'paladin'){
				job = 'pally';
				jobIndex = 2*12;
			} else if(job === 'prof' || job === 'professor'){
				job = 'prof';
				jobIndex = 14*12;
			} else if(job === 'sg' || job === 'starglad'){
				job = 'sg';
				jobIndex = 11*12;
			} else if(job === 'sinx' || job === 'assassin'){
				job = 'sinx';
				jobIndex = 9*12;
			} else if(job === 'sl' || job === 'linker'){
				job = 'sl';
				jobIndex = 15*12;
			} else if(job === 'sn' || job === 'super' || job === 'novice'){
				job = 'sn'
				jobIndex = 20*12;
			} else if(job === 'sniper' || job === 'snipe' || job === 'snip'){
				job = 'sniper';
				jobIndex = 5*12;
			} else if(job === 'stalker' || job === 'stalk'){
				job = 'stalker';
				jobIndex = 10*12;
			} else if(job === 'tk' || job === 'taekwon'){
				job = 'tk';
				jobIndex = 12*12;
			} else if(job === 'ws' || job === 'whitesmith'){
				job = 'ws';
				jobIndex = 18*12;
			} else {
				jobIndex = 22*12;
			}
			if(slot[slot.map(function(e) {return e.hueman}).indexOf(personName)].role === job){
				message.channel.send("It's the same job bishhhhhhh! :grimacing:");
			} else {
				isRoleAvailable = false;
				for(var x = 0; x<roleCount; x++){
					if(slot[x].role.toLowerCase() === job && slot[x].hueman === ''){
						tempSlot = slot.map(function(e) {return e.hueman}).indexOf(personName);
						slot[x].note = slot[tempSlot].note;
						slot[x].index = jobIndex - (12 - (slot[tempSlot].index % 12));
						newIndex = slot[x].index;
						slot[tempSlot].note = '';
						slot[tempSlot].index += 12 - (slot[tempSlot].index % 12);
						slot[tempSlot].hueman = '';
						oldIndex = slot[tempSlot].index;
						slot[x].hueman = personName;
						isRoleAvailable = true;
						slot.sort(function(a, b){return a.index-b.index});
						georgeRoster.where("name","==",personName).limit(1).get().then(snapshot =>{
							snapshot.forEach(doc => {
                console.log("Changing from " + doc.id);
								georgeRoster.doc(doc.id).update({
									name: "",
									note: "",
									index: oldIndex
								});
							});
						}).catch(err =>{
              console.log("Sam Ting Wong with changing former variable",err);
            });
						georgeRoster.where("role","==",job).where("name","==","").limit(1).get().then(snapshot =>{
							snapshot.forEach(doc => {
                console.log("Changing to " + doc.id);
								georgeRoster.doc(doc.id).update({
									name: personName,
									note: slot[x].note,
									index: newIndex
								});
							});
						}).catch(err =>{
              console.log("Sam Ting Wong with changing latter variable",err);
            });
						break;
					}
				}
				if(isRoleAvailable === false){
					slot[slot.map(function(e) {return e.hueman}).indexOf(personName)].role = job;
					slot[slot.map(function(e) {return e.hueman}).indexOf(personName)].index = jobIndex - (12- (slot[slot.map(function(e) {return e.hueman}).indexOf(personName)].index % 12));
					jobIndex = slot[slot.map(function(e) {return e.hueman}).indexOf(personName)].index;
					georgeRoster.where("name","==",personName).limit(1).get().then(snapshot =>{
						snapshot.forEach(doc => {
							georgeRoster.doc(doc.id).update({
								role: job,
								index: jobIndex
							});
						});
					}).catch(err =>{
            console.log("Sam Ting Wong with changing role which is still free",err);
          });
				}
				message.channel.send(":arrows_clockwise: Changed " + personName + "'s role to " + job.toUpperCase() + ".");
				slot.sort(function(a, b){return a.index-b.index});
			}
		}
	} else if (command === `${prefix}remove`) {
		if (isPartyCreated == false){
			message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
		} else if(!name){
			message.channel.send('Input the role you want to remove bishhhhhhh! :grimacing:\n```correct usage: !remove [name of role]```');
		} else if(!slot.some(e => e.role === name.toLowerCase())){
			message.channel.send('There is no such role in the parteh bishhhhhhh! :grimacing:');
		} else {
			if(slot[slot.map(function(e) {return e.role}).lastIndexOf(name.toLowerCase())].hueman === ''){
				georgeRoster.where("role","==",name.toLowerCase()).where("name","==","").limit(1).get().then(snapshot =>{
					snapshot.forEach(doc => {
						georgeRoster.doc(doc.id).update({
							role: "",
							index: 360
						});
					});
				}).catch(err =>{
          console.log("Sam Ting Wong with removing role excluding a hueman",err);
        });
				message.channel.send(":white_check_mark: " + name.toUpperCase() + " role has been removed. Muehuehuehuehue :japanese_goblin:");
			} else {
				tempSlot = slot[slot.map(function(e) {return e.role}).lastIndexOf(name.toLowerCase())].hueman;
				georgeRoster.where("role","==",name.toLowerCase()).where("name","==",tempSlot).limit(1).get().then(snapshot =>{
					snapshot.forEach(doc => {
						georgeRoster.doc(doc.id).update({
							role: "",
							name: "",
							index: 360
						});
					});
				}).catch(err =>{
          console.log("Sam Ting Wong with removing role including a hueman",err);
        });
				message.channel.send(":white_check_mark: " + name.toUpperCase() + " role has been removed together with " + tempSlot + ". Muehuehuehuehue :japanese_goblin:");
				slotCount--;
				georgeState.update({
					slotCount: slotCount
				});
			}
			slot.splice(slot.map(function(e) {return e.role}).lastIndexOf(name.toLowerCase()), 1);
			roleCount--;
			georgeState.update({
				roleCount: roleCount
			});
			slot[11] = {hueman:'', role:'', note:'', index:360};
		}
	} else if (command === `${prefix}join`) {
		if (isPartyCreated == false){
			message.channel.send('Nothing to join to bishhhhhhh! :grimacing:');
		} else if(slotCount >= roleCount){
			message.channel.send("Party roster is full bishhhhhhh! :grimacing:");
		} else if(slot.some(e => e.hueman === message.author.toString())){
			message.channel.send('You already joined bishhhhhhh! :grimacing:');
		} else if(!name){
			message.channel.send('Input the role you want to join bishhhhhhh! :grimacing:\n```correct usage: !join [name of role]```');
		} else {
			isRoleAvailable = false;
			for(var x = 0; x<roleCount; x++){
				if(slot[x].role.toLowerCase() === name.toLowerCase() && slot[x].hueman === ''){
					slot[x].hueman = message.author.toString();
					slotCount++;
					slot[x].index += slotCount - 12;
					jobIndex = slot[x].index;
					georgeState.update({
						slotCount: slotCount
					});
					isRoleAvailable = true;
					georgeRoster.where("role","==",name.toLowerCase()).where("name","==","").limit(1).get().then(snapshot =>{
						snapshot.forEach(doc => {
							console.log("Joining at " + doc.id)
							georgeRoster.doc(doc.id).update({
								name: message.author.toString(),
								index: jobIndex
							});
						});
					}).catch(err =>{
            console.log("Sam Ting Wong with joining a role",err);
          });
					message.channel.send(":white_check_mark: " + slot[x].hueman + " joined as " + slot[x].role.toUpperCase() + ".");
					slot.sort(function(a, b){return a.index-b.index});
					break;
				}
			}
			if(isRoleAvailable === false){
				message.channel.send('Role is not available bishhhhhhh! :grimacing:');
			}
		}
	} else if (command === `${prefix}invite`) {
		if (isPartyCreated == false){
			message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
		} else if(!name || !slot.some(e => e.role === name.toLowerCase())){
			message.channel.send('Input the role you want to join bishhhhhhh! :grimacing:\n```correct usage: !invite [name of role] [name of person]```');
		} 
		else if(!person){
			message.channel.send('Input the name of the hueman you want to invite bishhhhhhh! :grimacing:\n```correct usage: !invite [name of role] [name of person]```');
		} else if(slotCount >= roleCount){
			message.channel.send("Party roster is full bishhhhhhh! :grimacing:");
		} else {
			personName = content.slice(command.length + name.length + 2);
			if (personName.includes("<@!")){
				personName = personName.replace(/<@!/g,"<@");
			}
			if(slot.some(e => e.hueman === personName) === false){
				isRoleAvailable = false;
				for(var x = 0; x<roleCount; x++){
					if(slot[x].role.toLowerCase() === name.toLowerCase() && slot[x].hueman === ''){
            console.log(personName + " has been invited.")
						slot[x].hueman = personName;
						slotCount++;
						slot[x].index += slotCount - 12;
						jobIndex = slot[x].index;
						georgeState.update({
							slotCount: slotCount
						});
						isRoleAvailable = true;
						georgeRoster.where("role","==",name.toLowerCase()).where("name","==","").limit(1).get().then(snapshot =>{
							snapshot.forEach(doc => {
								console.log("Inviting at " + doc.id)
								georgeRoster.doc(doc.id).update({
									name: personName,
									index: jobIndex
								});
							});
						}).catch(err =>{
              console.log("Sam Ting Wong with inviting a hueman",err);
            });
						message.channel.send(":white_check_mark: Invited " + slot[x].hueman + " to join as " + slot[x].role.toUpperCase() + ".");
						slot.sort(function(a, b){return a.index-b.index});
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
	} else if (command === `${prefix}ditch`) {
		if (isPartyCreated === false){
			message.channel.send('Nothing to ditch from bishhhhhhh! :grimacing:');
		} else {
			if(slot.some(e => e.hueman === message.author.toString()) === false){
				message.channel.send("You're not even in the list bishhhhhhh! :grimacing:");
			} else {
				message.channel.send('NOOOOOoooooooooOOOOOOO\nDo you really want to ditch us!?\n(type y if yes.)');
				waitReply = true;
				const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 8000 });
				collector.on('collect', replyMsg => {
					if (waitReply === true){
						waitReply = false;
						if (replyMsg.content.toLowerCase() === "y") {
							var x = 1;
							slot.forEach(function(obj, pos) {
								if(obj.hueman === message.author.toString()){
									obj.hueman = "";
									obj.note = "";
									obj.index += 12 - (obj.index % 12);
									jobIndex = obj.index;
								} else if (obj.hueman !== "") {
									obj.index += 12 - (obj.index % 12) - x;
									x++;
								}
							});
							slot.sort(function(a, b){return a.index-b.index});
							x = 1;
							georgeRoster.orderBy("name").get().then(snapshot =>{
								snapshot.forEach(doc => {
									if(doc.data().name === message.author.toString()){
										console.log("Ditching " + doc.id)
										georgeRoster.doc(doc.id).update({
											name: "",
											note: "",
											index: jobIndex
										});
									} else if(doc.data().name !== ""){
										console.log("Adjusting index " + doc.id)
										tempSlot = doc.data().index + 12 - (doc.data().index % 12) - x;
										georgeRoster.doc(doc.id).update({
											index: tempSlot
										});
										x++;
									}
								});
							}).catch(err =>{
                console.log("Sam Ting Wong with ditching",err);
              });
							slotCount--;
							georgeState.update({
								slotCount: slotCount
							});
							message.channel.send(":negative_squared_cross_mark: A shameless person has ditched the parteh. :grimacing:");
						} else {
							message.channel.send("I'll take that as a NO then. :kissing:");
						}
					}
				})
			}
		}
	} else if (command === `${prefix}note`) {
		if (isPartyCreated == false){
			message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
		} else if(!slot.some(e => e.hueman === message.author.toString())){
			message.channel.send("You're not even in the parteh bishhhhhhh! :grimacing:");
		} else if(!name) {
			if(slot[slot.map(function(e) {return e.hueman}).indexOf(message.author.toString())].note === ''){
				message.channel.send("Your note is blank bishhhhhhh! :grimacing:\n```correct usage: !note [your message here]```");
			} else {
				slot[slot.map(function(e) {return e.hueman}).indexOf(message.author.toString())].note = '';
				georgeRoster.where("name","==",message.author.toString()).limit(1).get().then(snapshot =>{
					snapshot.forEach(doc => {
						console.log("Removing note " + doc.id)
						georgeRoster.doc(doc.id).update({
							note: "",
						});
					});
				}).catch(err =>{
          console.log("Sam Ting Wong with blank note",err);
        });
				message.channel.send(":negative_squared_cross_mark: The note has been shamelessly removed muehuehuehuehue :japanese_goblin:");
			}
		} else {
			slot[slot.map(function(e) {return e.hueman}).indexOf(message.author.toString())].note = " (" + content.slice(6) + ")";
			georgeRoster.where("name","==",message.author.toString()).limit(1).get().then(snapshot =>{
				snapshot.forEach(doc => {
					console.log("Adding note " + doc.id)
					georgeRoster.doc(doc.id).update({
						note: " (" + content.slice(6) + ")",
					});
				});
			}).catch(err =>{
        console.log("Sam Ting Wong with adding a note",err);
      });
			message.channel.send(":white_check_mark: The note has been shamelessly added muehuehuehuehue :japanese_goblin:");
		}
	} else if (command === `${prefix}kick`) {
		personName = content.slice(command.length + 1);
		if (personName.includes("<@!")){
			personName = name.replace(/<@!/g,"<@");
		}
		if (isPartyCreated == false){
			message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
		} else if(!name){
			message.channel.send("Input a name bishhhhhhh! :grimacing:\n```correct usage: !kick [name of person]```");
		} else if(slot.some(e => e.hueman === personName) === false){
			message.channel.send(personName + " is not even in the parteh bishhhhhhh! :grimacing:");
		} else {
      console.log(personName + " has been kicked.")
			var x = 1;
			slot.forEach(function(obj, pos) {
				if(obj.hueman === personName){
					obj.hueman = "";
					obj.note = "";
					obj.index += 12 - (obj.index % 12);
					jobIndex = obj.index;
				} else if (obj.hueman !== "") {
					obj.index += 12 - (obj.index % 12) - x;
					x++;
				}
			});
			slot.sort(function(a, b){return a.index-b.index});
			x = 1;
			georgeRoster.orderBy("name").get().then(snapshot =>{
				snapshot.forEach(doc => {
					if(doc.data().name === personName){
						console.log("Ditching " + doc.id)
						georgeRoster.doc(doc.id).update({
							name: "",
							note: "",
							index: jobIndex
						});
					} else if(doc.data().name !== ""){
						console.log("Adjusting index " + doc.id)
						tempSlot = doc.data().index + 12 - (doc.data().index % 12) - x;
						georgeRoster.doc(doc.id).update({
							index: tempSlot
						});
						x++;
					}
				});
			}).catch(err =>{
        console.log("Sam Ting Wong with kicking a hueman",err);
      });
			slotCount--;
			georgeState.update({
				slotCount: slotCount
			});
			message.channel.send(":negative_squared_cross_mark: "+personName+" has been shamelessly kicked hard out of the parteh muehuehuehuehue :japanese_goblin:");
		}
	} else if (command === `${prefix}info`) {
		if (isPartyCreated == false){
			message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
		} else if(organizer != message.author.toString()){
			message.channel.send('Only the organizer ' + organizer + ' can put info in the parteh of despair! muehuehuehuehuehue :japanese_goblin:');
		} else if(!name){
			if(info === ''){
				message.channel.send("Your info is blank bishhhhhhh! :grimacing:\n```correct usage: !info [your message here]```");
			} else {
				info = '';
				georgeState.update({rosterInfo: info});
				message.channel.send(":negative_squared_cross_mark: Additional information for the parteh has been shamelessly removed muehuehuehuehue :japanese_goblin:");
			}
		} else {
			info = "\n" + content.slice(6);
			georgeState.update({rosterInfo: info});
			message.channel.send(":white_check_mark: Additional information for the parteh has been shamelessly added muehuehuehuehue :japanese_goblin:");
		}
	} else if (command === `${prefix}party`) {
if (isPartyCreated == false){
			message.channel.send("There's no parteh yet bishhhhhhh! :grimacing:");
}
		else if(organizer !== message.author.toString()){
			message.channel.send('Only the organizer ' + organizer + ' can use this command of despair! muehuehuehuehuehue :japanese_goblin:');
		}
		else if (name == 'default'){
			partyRosterString = '';
			roleCount = 12;
			slotCount = 0;
			slot = [{hueman:'', role:'champ', note:'', index:12},
			{hueman:'', role:'pally', note:'', index:24},
			{hueman:'', role:'hp', note:'', index:36},
			{hueman:'', role:'hp', note:'', index:36},
			{hueman:'', role:'hw', note:'', index:48},
			{hueman:'', role:'sniper', note:'', index:60},
			{hueman:'', role:'sniper', note:'', index:60},
			{hueman:'', role:'bio', note:'', index:96},
			{hueman:'', role:'flex', note:'', index:228},
			{hueman:'', role:'flex', note:'', index:228},
			{hueman:'', role:'flex', note:'', index:228},
			{hueman:'', role:'flex', note:'', index:228}];
			georgeState.update({
				roleCount: roleCount,
				slotCount: slotCount
			});
			message.channel.send(":white_check_mark: George has setup the party roster cuz " + organizer + " is too lazeh :japanese_goblin:");
			let i = 0;
      georgeRoster.get().then(snapshot =>{
        snapshot.forEach(doc =>{
          console.log(i + ".) " + slot[i].role);
          georgeRoster.doc(doc.id).update({
            name: "",
            role: slot[i].role,
            note: "",
            index: slot[i].index
          });
          i++;
        });
      }).catch(err =>{
        console.log("Sam Ting Wong with ze parteh command",err);
      });
      for(var x = 0; x < 12; x++){
				if(slot[x].role===''){
					partyRosterString = partyRosterString.concat(":free: (Free)\n");
				}
				else{
					if(slot[x].role==='asura'){
						partyRosterString = partyRosterString.concat(":punch: Asura: " + slot[x].hueman + slot[x].note + "\n");
					} else ifif(slot[x].role==='bio'){
						partyRosterString = partyRosterString.concat(":moneybag: Bio: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='champ'){
						partyRosterString = partyRosterString.concat(":mechanical_arm: Champ: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='clown'){
						partyRosterString = partyRosterString.concat(":guitar: Clown: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='flex'){
						partyRosterString = partyRosterString.concat(":star: Flex: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='gs'){
						partyRosterString = partyRosterString.concat(":gun: GS: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='gypsy'){
						partyRosterString = partyRosterString.concat(":dancer: Gypsy: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='hp'){
						partyRosterString = partyRosterString.concat(":syringe: HP: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='hw'){
						partyRosterString = partyRosterString.concat(":sparkles: HW: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='lk'){
						partyRosterString = partyRosterString.concat(":crossed_swords: LK: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='ninja'){
						partyRosterString = partyRosterString.concat(":chopsticks: Ninja: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='pally'){
						partyRosterString = partyRosterString.concat(":shield: Pally: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='prof'){
						partyRosterString = partyRosterString.concat(":book: Prof: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='sg'){
						partyRosterString = partyRosterString.concat(":star: SG: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='sinx'){
						partyRosterString = partyRosterString.concat(":knife: SinX: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='sl'){
						partyRosterString = partyRosterString.concat(":link: SL: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='sn'){
						partyRosterString = partyRosterString.concat(":school_satchel: SN: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='sniper'){
						partyRosterString = partyRosterString.concat(":bow_and_arrow: Sniper: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='stalker'){
						partyRosterString = partyRosterString.concat(":spy: Stalker: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='tk'){
						partyRosterString = partyRosterString.concat(":martial_arts_uniform: TK: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='ws'){
						partyRosterString = partyRosterString.concat(":hammer: WS: " + slot[x].hueman + slot[x].note + "\n");
					} else {
						partyRosterString = partyRosterString.concat(":bust_in_silhouette: " + slot[x].role + ":" + slot[x].hueman + slot[x].note + "\n");
					}
				}
			}
			if(partehTime !== null){
				var currentTime = new Date();
				currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
				var diffTime = (partehTime - currentTime) / 60000;
				partehHour = Math.trunc(diffTime / 60);
				partehMinute = Math.round(diffTime % 60);
				if(partehTime >= currentTime){
					timeMsg = "(";
					if(partehHour > 0){
						timeMsg = timeMsg.concat(partehHour + " hours ");
					}
					timeMsg = timeMsg.concat(partehMinute + " minutes before the start of despair)");
				} else {
					timeMsg = "(ongoing despair muehuehuehuehue :japanese_goblin:)";
				}
			}
			orgMsg = 'Organized by ' + organizer + ' :grimacing:\n\n';
			const embed = new RichEmbed()
			  .setTitle("Strange Despair's " + runName + " " + timeMsg)
			  .setColor(colorEmbed)
			  .setDescription(orgMsg + partyRosterString + "\n" + info)
			  .setFooter('Parteh Members: ' + slotCount + ' / ' + roleCount);
			message.channel.send(embed);
		} else if (name == 'wipe'){
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
						georgeState.update({
							roleCount: 0,
							slotCount: 0
						});
						georgeRoster.get().then((snapshot)=> {
							snapshot.docs.forEach(doc =>{
								georgeRoster.doc(doc.id).update({
									name: "",
									role: "",
									note: "",
									index: 360
								});
							})
						}).catch(err =>{
              console.log("Sam Ting Wong with wiping",err);
            });
						message.channel.send(":negative_squared_cross_mark: The parteh roster has now been wiped clean. :grimacing:");
						const embed = new RichEmbed()
						  .setTitle("Strange Despair's " + runName + " " + timeMsg)
						  .setColor(colorEmbed)
						  .setDescription(orgMsg + partyRosterString + "\n" + info)
						  .setFooter('Parteh Members: ' + slotCount + ' / ' + roleCount);
						message.channel.send(embed);
					} else {
						message.channel.send("I'll take that as a NO then. :kissing:");
					}
				}
			})
		} else {
			message.channel.send("Wrong command bishhhhhhh! :grimacing:\n```correct usage: !party default\n!party wipe```");
		}
	} else if (command === `${prefix}poke` || command === `${prefix}summon` || command === `${prefix}tag`) {
		if(isPartyCreated === false){
			message.channel.send("There's no party roster yet bishhhhhhh!! :grimacing:");
		} else {
			partyRosterString = '';
			for(var x = 0; x<12; x++){
				if(slot[x].hueman.length > 0){
					partyRosterString = partyRosterString.concat(slot[x].hueman + ' ');
				}
			}
			if(partyRosterString.length > 0){
				message.channel.send(":white_check_mark: I activate my spell card to special summon " + partyRosterString + "in attack position!");
			} else {
				message.channel.send("There's no huemans in the party roster bishhhhhhh!! :grimacing:");
			}
		}
	} else if (command === `${prefix}view`) {
		if (isPartyCreated == false){
			message.channel.send('Nothing to view bishhhhhhh! :grimacing:');
		} else if(isPartyCreated == true){
			partyRosterString = '';
			for(var x = 0; x < 12; x++){
				if(slot[x].role===''){
					partyRosterString = partyRosterString.concat(":free: (Free)\n");
				} else {
					if(slot[x].role==='asura'){
						partyRosterString = partyRosterString.concat(":punch: Asura: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='bio'){
						partyRosterString = partyRosterString.concat(":moneybag: Bio: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='champ'){
						partyRosterString = partyRosterString.concat(":mechanical_arm: Champ: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='clown'){
						partyRosterString = partyRosterString.concat(":guitar: Clown: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='flex'){
						partyRosterString = partyRosterString.concat(":star: Flex: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='gs'){
						partyRosterString = partyRosterString.concat(":gun: GS: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='gypsy'){
						partyRosterString = partyRosterString.concat(":dancer: Gypsy: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='hp'){
						partyRosterString = partyRosterString.concat(":syringe: HP: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='hw'){
						partyRosterString = partyRosterString.concat(":sparkles: HW: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='lk'){
						partyRosterString = partyRosterString.concat(":crossed_swords: LK: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='ninja'){
						partyRosterString = partyRosterString.concat(":chopsticks: Ninja: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='pally'){
						partyRosterString = partyRosterString.concat(":shield: Pally: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='prof'){
						partyRosterString = partyRosterString.concat(":book: Prof: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='sg'){
						partyRosterString = partyRosterString.concat(":star: SG: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='sinx'){
						partyRosterString = partyRosterString.concat(":knife: SinX: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='sl'){
						partyRosterString = partyRosterString.concat(":link: SL: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='sn'){
						partyRosterString = partyRosterString.concat(":school_satchel: SN: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='sniper'){
						partyRosterString = partyRosterString.concat(":bow_and_arrow: Sniper: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='stalker'){
						partyRosterString = partyRosterString.concat(":spy: Stalker: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='tk'){
						partyRosterString = partyRosterString.concat(":martial_arts_uniform: TK: " + slot[x].hueman + slot[x].note + "\n");
					} else if(slot[x].role==='ws'){
						partyRosterString = partyRosterString.concat(":hammer: WS: " + slot[x].hueman + slot[x].note + "\n");
					} else {
						partyRosterString = partyRosterString.concat(":bust_in_silhouette: " + slot[x].role + ":" + slot[x].hueman + slot[x].note + "\n");
					}
				}
			}
			if(partehTime !== null){
				var currentTime = new Date();
				currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
				var diffTime = (partehTime - currentTime) / 60000;
				partehHour = Math.trunc(diffTime / 60);
				partehMinute = Math.round(diffTime % 60);
				if(partehTime >= currentTime){
					timeMsg = "(";
					if(partehHour > 0){
						timeMsg = timeMsg.concat(partehHour + " hours ");
					}
					timeMsg = timeMsg.concat(partehMinute + " minutes before the start of despair)");
				} else {
					timeMsg = "(ongoing despair muehuehuehuehue :japanese_goblin:)";
				}
			}
			orgMsg = 'Organized by ' + organizer + ' :grimacing:\n\n';
			const embed = new RichEmbed()
			  .setTitle("Strange Despair's " + runName + " " + timeMsg)
			  .setColor(colorEmbed)
			  .setDescription(orgMsg + partyRosterString + "\n" + info)
			  .setFooter('Parteh Members: ' + slotCount + ' / ' + roleCount);
			message.channel.send(embed);
		}
	} else if (command === `${prefix}organizer`) {
		personName = content.slice(command.length + 1);
		if (personName.includes("<@!")){
			personName = name.replace(/<@!/g,"<@");
		}
		if (isPartyCreated == false){
			message.channel.send('There is no parteh yet bishhhhhhh! :grimacing:');
		} else if(organizer === personName){
			message.channel.send('You are the organizer bishhhhhhhhh! :grimacing:');
		} else if(!personName){
			message.channel.send("You didnt specify a name bishhhhhhh! :grimacing:\n```correct usage: !organizer [new organizer of despair]```");
		} else if(!slot.some(e => e.hueman === personName)){
			message.channel.send("The new organizer must also be in the roster of despair bishhhhhhh! :grimacing:");
		} else {
			message.channel.send(":white_check_mark: I tribute " + organizer + " to tribute summon Despair Organizer " + personName + " in attack position!");
			organizer = personName;
			georgeState.update({organizer: organizer});
		}
	} else if (command === `${prefix}disband`) {
		if (isPartyCreated == false){
			message.channel.send('Nothing to disband bishhhhhhh! :grimacing:');
		} else if(organizer != message.author.toString()){
			message.channel.send('Only the organizer ' + organizer + ' can disband the parteh of despair! muehuehuehuehuehue :japanese_goblin:');
		} else {
			message.channel.send('NOOOOOoooooooooOOOOOOO\nDo you really want to disband the parteh!?\n(type y if yes.)');
			waitReply = true;
			const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 8000 });
			collector.on('collect', replyMsg => {
				if (waitReply === true){
					waitReply = false;
					if (replyMsg.content.toLowerCase() === "y") {
						partehTime = null;
						runName = '';
						info = '';
						roleCount = 0;
						slotCount = 0;
						isPartyCreated = false;
						for(var x=0; x<12; x++){
							slot[x] = {hueman:'', role:'', note:'', index:360};
						}
						georgeState.update({
							rosterName: "",
							organizer: "",
							partyHour: 0,
							partyMinute: 0,
							rosterInfo: "",
							roleCount: 0,
							slotCount: 0,
							isPartyCreated: false
						});
						georgeRoster.get().then((snapshot)=> {
							snapshot.docs.forEach(doc =>{
								georgeRoster.doc(doc.id).update({
									name: "",
									role: "",
									note: "",
									index: 360
								});
							})
						}).catch(err =>{
              console.log("Sam Ting Wong with disbanding",err);
            });
						message.channel.send(":negative_squared_cross_mark: The parteh has now been devoured deep within the abyssal void. :grimacing:");
					}
					else{
						message.channel.send("I'll take that as a NO then. :kissing:");
					}
				}
			})
		}
	} else if (command === `${prefix}help`|| command === `${prefix}halp`) {
		message.author.send("George Bot for dummies:");
		message.author.send(helpMsg);
		message.channel.send("Psst " + message.author.toString() + "... I have secretly sent noods to you via PM muehuehuehue :japanese_goblin:");
	} else if (command === `${prefix}time`) {
		if (isPartyCreated == false){
			message.channel.send('Nothing to set time to bishhhhhhh! :grimacing:');
		} else if(organizer != message.author.toString()){
			message.channel.send('Only the organizer ' + organizer + ' can set the time of despair! muehuehuehuehuehue :japanese_goblin:');
		} else if (!name){
			message.channel.send('Set a time for the parteh bishhhhhhh! :grimacing:');
		} else if(!name.includes(":") || name.length !== 5){
			message.channel.send('Set a proper time bishhhhhhh! :grimacing:\n```usage: !time hh:mm```');
		} else {
			setTime = name.split(":");
			if(isNaN(parseInt(setTime[0])) || isNaN(parseInt(setTime[1]))){
				message.channel.send('Set a proper time bishhhhhhh! :grimacing:\n```correct usage: !time hh:mm```');
			} else {
				var currentTime = new Date();
				partehTime = new Date();
				partehHour = parseInt(setTime[0], 10)-2;
				partehMinute = parseInt(setTime[1], 10);
				georgeState.update({
					partyHour: parseInt(setTime[0], 10),
					partyMinute: parseInt(setTime[1], 10)
				});
				partehTime.setHours(partehHour);
				partehTime.setMinutes(partehMinute);
				partehTime.setMinutes(parseInt(setTime[1], 10) - partehTime.getTimezoneOffset());
				currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());
				partehTime.setDate(partehTime.getDate() + (partehTime < currentTime));
				timeMsg = (partehTime.getMonth() + 1) + "/" + partehTime.getDate() + "/" + partehTime.getFullYear() + " ";
				if(partehHour<8){
				  timeMsg = timeMsg + "0";
				}
				timeMsg = timeMsg + (partehTime.getHours()+2) + ":"
				if(partehMinute<10){
				  timeMsg = timeMsg + "0";
				}
				timeMsg = timeMsg + partehTime.getMinutes() + " GMT+2 (tRO Server Time)";
				message.channel.send(
				  ":white_check_mark: Countdown to total despair has been set muehuehuehuehue :japanese_goblin:\nParteh time: " +
					timeMsg
				);
				var diffTime = (partehTime - currentTime) / 60000;
				partehHour = Math.trunc(diffTime / 60);
				partehMinute = diffTime % 60;
			}
		}
	} else if (command.startsWith(prefix)) {
		message.channel.send("Bishhhhhhhh! Wat da heck is dat command!? :japanese_goblin:\n```Type !help for command list```");
	}
});

//keepAlive();
//client.login(process.env.TOKEN).catch(console.error);
// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);
