const Gatherer = require('../src/twitch/gatherer');
const tools = require('../src/tools/tools');


const gatherer = new Gatherer();
const channels = tools.channels.channels

for (const channel of channels) {
    setTimeout(async e => {
        await gatherer.getChannel(channel)
        setInterval(async e => {
            await gatherer.getLiveInfo(channel);
        }, tools.conf.gatherer.info_delay * 1_000)
    }, 5000)
}