var express = require('express');
const db = require("../../db/db").db;
var router = express.Router();

router.get("/e", function (req, res, next) {
    res.send("api")
})

router.get('/test', (req, res) => {
    res.send("This is a test response, please ignore");
})

router.get("/twitch/:param", async (req, res) => {

    const param = req.params.param;

    if (param === 'channel') {
        const values = Object.keys(req.query);
        console.log(values)
        if (values.includes("channel_name")) {
            const channel = await db.findChannelByName(req.query.channel_name);
            res.send([channel]);

        } else if (values.includes("channel_id")) {
            const channel = await db.findChannelByID(req.query.channel_id);
            res.send([channel]);
        } else {
            const channel = await db.findNumberOfChannel(req.query.number);
            if (channel.status === 'success') {
                res.send(channel.data)
            } else {
                res.status(400).send("BAD REQUEST");
            }

        }


    }

    if (param === 'stats') {
        const values = Object.keys(req.query);
        console.log(values)
        if (values.includes("channel_name")) {

        } else if (values.includes("channel_id")) {
            const stats = await db.getStreamStats(req.query.channel_id);
            res.send(stats);
        } else {
            res.status(400).send("BAD REQUEST");
        }
    } //else res.send('303')
})


module.exports = router;