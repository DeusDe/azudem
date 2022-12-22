var express = require('express');
var router = express.Router();

const tools = require('../../tools/tools')

const DiscordBot = require('../../discord/discord');
const TwitchBot = require('../../twitch/irc/irc');
const TwitchApi = require('../../twitch/api/api')

const discordBot = new DiscordBot(tools.env.DISCORD_TOKEN, new TwitchApi(tools.env.TWITCH_CLIENT_ID, tools.env.TWITCH_CLIENT_SECRET));
const twitchBot = new TwitchBot(tools.conf.tmi)

module.exports = router;