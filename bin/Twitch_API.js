//Twitch API
const tools = require('../src/tools/tools')

const twitchAPI = require('../src/twitch/api/api').createDefaultAPI();

const dotenv = require('dotenv')
dotenv.config()


async function test() {
    await tools.delay(1000)

    await twitchAPI.getStreamByChannelName('ungespielt')


}


test()