//Twitch API
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const twitchAPI = require('../twitch/api/api').API;

async function test() {
    await delay(1000)
    //console.log(await twitchAPI.getUserByChannelName('ungespielt'));
    //console.log(await twitchAPI.getVideoByChannelID('36983084'));
    //console.log(await twitchAPI.getFollowListToID(36983084))

}


test()