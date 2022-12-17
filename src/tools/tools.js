module.exports = class tools {

    static delay = (ms) => new Promise((res) => setTimeout(res, ms));

}