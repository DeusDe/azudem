const tmi = require('tmi.js');

class twitchIRC {
    constructor(config) {
        this.client = tmi.Client(config);
        this.client.connect()
    }
}

exports.IRC = twitchIRC;