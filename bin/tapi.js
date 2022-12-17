//Twitch API
const tools = require('../src/tools/tools')

const twitchAPI = require('../src/twitch/api/api').createDefaultAPI();

async function test() {
    await tools.delay(1000)
    console.log(await twitchAPI.getUserByChannelName('ungespielt'));
    console.log(await twitchAPI.getVideoByChannelID('36983084'));
    console.log(await twitchAPI.getFollowListToID(36983084))

}


test()