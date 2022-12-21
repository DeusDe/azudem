const mongodb = require('mongodb');
const mongoose = require('mongoose')
const {ObjectID} = require("mongodb");
const dotenv = require('dotenv')
dotenv.config()
const env = process.env;

const channel = require('./Shemas/twitchAPI/channelShema').Channel;

console.log(env.MONGODB_URI)

const liveInfo = require('./Shemas/twitchAPI/liveInfoShema.js').LiveInfo;


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

  async findNumberOfChannel(number) {
    if (typeof number === 'undefined') {
      number = 20;
    } else if (number > 100) {
      return {status: 'number is too high'}
    } else if (number < 1) {
      return {status: 'number is too low'}
    }
    const data = await channel.Model.find({}).limit(number);
    return {status: 'success', data}

  }

  async getStreamStats(id, limit) {
    return liveInfo.Model.find({inherited_by_channel: id}).limit(limit);
  }

}