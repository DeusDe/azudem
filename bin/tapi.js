//Twitch API
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const twitchAPI = require('../twitch/api/api').API;

async function test() {
    await delay(1000)
    console.log(await twitchAPI.getStreamByName('ungespielt'));
    console.log(await twitchAPI.getStreamByID('36983084'));

}


test()