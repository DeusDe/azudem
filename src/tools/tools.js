module.exports = class tools {
    static conf = require('../conf/config.json');
    static channels = require('../conf/init_channels.json')
    static delay = (ms) => new Promise((res) => setTimeout(res, ms));

}