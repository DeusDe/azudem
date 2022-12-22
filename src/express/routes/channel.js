var express = require('express');
const tools = require('../../tools/tools')
const dotenv = require('dotenv')
dotenv.config()
const env = process.env;
const DB = require("../../db/db");
const db = new DB(`${env.MONGODB_URI}/${tools.conf.database.stats_database}?retryWrites=true&w=majority`);
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    const channels = await db.findNumberOfChannel(20);
    res.render('channelHome', {channels: channels.data})
});

router.get("/:channel", async function (req, res, next) {

    const channel = await db.findChannelByName(req.params.channel);

    //If Channel was not found
    if (typeof channel === 'undefined' || channel === null) {
        res.render('error', {
            message: 'Channel Not Found',
            error: {
                status: 404,
                stack: {}
            }
        })
        return;
    }
    const stats = await db.getStreamStats(channel.channel_id, 20);
    const date = [];
    const viewer_count = [];
    console.log(channel)
    for (const element of stats) {
        date.push(new Date(element.timestamp).toLocaleString());
        viewer_count.push(element.viewer_count);
    }

    res.render('channel',
        {
            channelName: req.params.channel,
            api: channel,
            stats: {x: date, y: viewer_count}
        }
    );
})

module.exports = router;
