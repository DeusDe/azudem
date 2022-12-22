const tmi = require('tmi.js');


module.exports = class twitchIRC {
    constructor(config) {
        this.client = tmi.Client(config);
        this.client.connect()
    }
};