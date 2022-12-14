//TWITCH Internet Relay Chat

const tmi = require('tmi.js');

const conf = require('../config.json');

client = tmi.Client(conf.tmi)
client.connect()