var express = require('express');
const db = require("../db/db").db;
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send("Yes");
});

router.get("/:channel", async function (req, res, next) {

    const channel = await db.findChannelByName(req.params.channel);

    //If Channel was not found
    if (typeof channel === 'undefined' || channel === null) {
        res.send('Channel Not Found')
        return;
    }
    const stats = await db.getStreamStats(channel._id);
    const t = [];
    for (const element of stats) {
        t.push({views: element.viewer_count, time: element.timestamp})
        console.log(element)
    }

    res.render('channel',
        {
            channelName: req.params.channel,
            api: channel,
            stats: t
        }
    );
})

module.exports = router;
