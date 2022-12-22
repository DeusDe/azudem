var express = require('express');
const tools = require('../../tools/tools')
const dotenv = require('dotenv')
const sanitize = require('mongo-sanitize')
dotenv.config()
const env = process.env;
const DB = require("../../db/db");
const {parse} = require("dotenv");
const db = new DB(`${env.MONGODB_URI}/${tools.conf.database.stats_database}?retryWrites=true&w=majority`);
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    const values = Object.keys(req.query);
    console.log(values)


    let size = 20;
    if (values.includes('size')) {
        let rawSize = req.query["size"];
        console.log(rawSize)
        if (rawSize === "100" || rawSize === "50" || rawSize === "20") {
            size = parseInt(rawSize)
        }
    }

    let site = 0;
    if (values.includes('site')) {
        let rawSite = req.query["site"];
        console.log(rawSite)
        if (rawSite > 1 && rawSite <= 100) {
            site = parseInt(rawSite) - 1
        }
    }

    const channels = await db.findNumberOfChannel(sanitize(size), sanitize(site));
    res.render('channelHome', {channels: channels.data, site, size})
});

router.get("/:channel", async function (req, res, next) {

    const channel = await db.findChannelByName(sanitize(req.params.channel));

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
    const stats = await db.getStreamStats(sanitize(channel.channel_id), 20);
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
