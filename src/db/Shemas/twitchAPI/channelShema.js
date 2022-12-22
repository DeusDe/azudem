const mongoose = require('mongoose')

const channel = new mongoose.Schema({
    channel_id: String,
    channel_name: String,
    channel_display_name: String,
    description: String,
    type: String,
    broadcaster_type: String,
    thumbnail_url: String,
    offline_image_url: String,
    view_count: Number,
    created_at: Date,
    priority: Number,
});

const Channel = {
  Shema: channel,
  Model: mongoose.model('Channel', channel),
};

exports.Channel = Channel;
