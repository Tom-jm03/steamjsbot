const SteamUser = require('steam-user');
const GlobalOffensive = require('globaloffensive');
require('dotenv').config();
let user = new SteamUser();
let csgo = new GlobalOffensive(user);
let steamID = '76561198417348470';

// import accountName and password from .env
const accountName = process.env.username;
const password = process.env.password;

console.log(accountName, password);

  user.logOn({
    accountName: accountName,
    password: password,
  });

user.on('loggedOn', () => {
    console.log('Logged in');
    user.setPersona(SteamUser.EPersonaState.Online);
});
user.on("playingState", function (blocked, playingApp) {
    if (blocked) console.log(`Started playing somewhere (blocked: ${blocked}) Awaiting until disconnect`);
    else console.log(`Started playing ${playingApp}`);
    user.gamesPlayed([730]);
});
//acceppt all incoming friend requests
user.on('friendRelationship', (steamID, relationship) => {
    if (relationship === SteamUser.EFriendRelationship.RequestRecipient) {
        user.addFriend(steamID);
        console.log('Accepted friend request from ' + steamID);
    }
});

// send a message to a friend
user.on('friendMessage', (steamID, message) => {
    user.chatMessage(steamID, 'Hi, ich bin ein Bot, der dir CS:GO Stats anzeigt. \nGib mir einfach deinen Steam Namen oder deine Steam ID und ich zeige dir deine Stats an. \n Dafür muss der jenige mich aber in der Freundesliste haben.');
});