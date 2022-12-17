const mongoose = require('mongoose')

const channel = new mongoose.Schema({
  channel_id: String,
  channel_name: String,
  channel_display_name: String,
  priority: Number,
  thumbnail_url: String,
  offline_image_url: String,
  created_at: String,
});

const Channel = {
  Shema: channel,
  Model: mongoose.model('Channel', channel),
};

exports.Channel = Channel;
