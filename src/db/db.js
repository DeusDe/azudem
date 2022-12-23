const mongodb = require('mongodb');
const mongoose = require('mongoose')
const {ObjectID} = require("mongodb");
const dotenv = require('dotenv')
dotenv.config()
const env = process.env;

const channel = require('./Shemas/twitchAPI/channelShema').Channel;

console.log(env.MONGODB_URI)

const liveInfo = require('./Shemas/twitchAPI/liveInfoShema.js').LiveInfo;
const user = require('./Shemas/www/userShema').User;

module.exports = class database {
  constructor(URI) {
    mongoose.set('strictQuery', false)
    try {
      mongoose.connect(URI, {serverApi: mongodb.ServerApiVersion.v1}, () => {
      })
    } catch (e) {
      console.log('could not connect');
    }
  }

    async findChannelByID(channel_id) {
        return channel.Model.findOne({channel_id});
    }

    async findChannelByName(channel_name) {
        return channel.Model.findOne({channel_name});
    }

    async channelExists(id) {
        const chaBuf = await channel.Model.findOne({channel_id: id});
        return chaBuf !== null;
    }

    async findNumberOfChannel(number, page) {
        if (typeof number === 'undefined') {
            number = 20;
        } else if (number > 100) {
            return {status: 'number is too high'}
        } else if (number < 1) {
            return {status: 'number is too low'}
        }
        const data = await channel.Model.find({}).skip(page * number).limit(number);
        return {status: 'success', data}

    }

    async getStreamStats(id, limit) {
        return liveInfo.Model.find({channel_id: id}).limit(limit);
    }

    async createChannel(chnl) {
        if (await this.channelExists(chnl.channel_id)) return;
        channel.Model.create(chnl);
    }

    async createLiveInfo(info) {
        liveInfo.Model.create(info)
    }

    async userExists(username){
        const userBuf = await user.Model.findOne({username});
        return userBuf !== null;
    }

    async findUserByUsername(username){
      return user.Model.findOne({username});
    }
}