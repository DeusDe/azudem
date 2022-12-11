const mongoose = require('mongoose')

const liveInfo = new mongoose.Schema({
  timestamp: Date,
  started_at: Date,
  user_id: String,
  channel_id: String,
  game_id: String,
  title: String,
  viewer_count: Number,
  language: String,
  tag_ids: [],
  is_mature: Boolean,
  inherited_by_channel: mongoose.Types.ObjectId,
});

const LifeInfo = {
  Shema: liveInfo,
  Model: mongoose.model('LiveInfo', liveInfo),
};

exports.LiveInfo = LifeInfo

