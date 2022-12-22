const mongoose = require('mongoose')

const liveInfo = new mongoose.Schema({
    channel_id: String,
    channel_name: String,
    stream_id: String,
    channel_display_name: String,
    timestamp: Date,
    game_id: String,
    type: String,
    title: String,
    viewer_count: Number,
    started_at: Date,
    language: String,
    tag_ids: Array,
    tags: Array,
    is_mature: Boolean,
});

const LifeInfo = {
  Shema: liveInfo,
  Model: mongoose.model('LiveInfo', liveInfo),
};

exports.LiveInfo = LifeInfo

