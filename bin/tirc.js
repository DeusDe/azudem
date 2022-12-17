const conf = require('../src/conf/config.json');
const {IRC} = require("../src/twitch/irc/irc");


const twitchIRC = new IRC(conf.tmi)