const SteamUser = require('steam-user');
const GlobalOffensive = require('globaloffensive');
const SteamID = require("steamid");
const { GuildExplicitContentFilter, DataResolver } = require('discord.js');
require('dotenv').config();
const user = new SteamUser();
const csgo = new GlobalOffensive(user);
// let steamID = '76561198417348470';
// const fs = require('fs');

// import accountName and password from .env
const accountName = process.env.username;
const password = process.env.password;

//console.log(accountName, password);

  user.logOn({
    accountName: accountName,
    password: password,
  });

user.on('loggedOn', () => {
    console.log('Logged in');
    user.setPersona(SteamUser.EPersonaState.Online);
});
user.on('playingState', function (blocked, playingApp) {
    if (blocked) console.log(`Started playing somewhere (blocked: ${blocked}) Awaiting until disconnect`);
    else console.log(`Started playing ${playingApp}`);
    user.gamesPlayed([730]);
});
// acceppt all incoming friend requests
user.on('friendRelationship', (steamID, relationship) => {
    if (relationship === SteamUser.EFriendRelationship.RequestRecipient) {
        user.addFriend(steamID);
        console.log('Accepted friend request from ' + steamID);
        user.chatMessage(steamID, 'Hi, na? Join unserem Discord https://discord.gg/jc6Ygk9 und schau mal vorbei!');
    }
});

// send a message to a friend
user.on('friendMessage', (steamID, message) => {
    if (message == 'info') {
        user.chatMessage(steamID, 'Hi, ich bin ein Bot, der dir CS:GO Stats anzeigt. \nGib mir einfach deinen Steam Namen oder deine Steam ID und ich zeige dir deine Stats an. \n Dafür muss der jenige mich aber in der Freundesliste haben.');
    }
});

// check if we have a gc session
csgo.on('ready', () => {
    console.log('GC ready');
});


csgo.on('connectedToGC', () => {
    console.log('Connected to GC');
});

// a function to get the accountData from the steamID

csgo.on('accountData', (accountData) => {
    console.log(accountData);
    console.log(csgo.accountData);
    console.log(accountData.player_level);
});

user.on('friendMessage', (steamID, message) => {
    if (message == 'stop') {
        if (steamID == '76561198417348470') {
        user.chatMessage(steamID, 'Ok, ich stoppe jetzt');
        user.gamesPlayed([]);
        user.logOff();
    } else {
        user.chatMessage(steamID, 'Nö');
    }
    }
});
csgo.on('playersProfile', function(data) {
    console.log('got profile');
});
user.on('friendMessage', (steamID, message) => {
    if (message == 'stats') {
        if (csgo.haveGCSession) {
            const steamid = new SteamID(steamID.toString());
            const final = steamid.accountid.toString();
            csgo.requestPlayersProfile(steamid, function(data) {
                // console.log(data);
                user.chatMessage(steamID, 'Wins in Matchmaking: ' + data.ranking.wins + '\n' + 'Wins in Wingman: ' + data.rankings[0].wins + '\n' + 'Wins in Dangerzone: ' + data.rankings[1].wins);
            });
        }else {
            user.chatMessage(steamID, 'Nö');
        }
    }
});
