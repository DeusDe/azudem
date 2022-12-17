const mongoose = require('mongoose')

const messageShema = new mongoose.Schema({
  timestamp: Date,
  message: String,
  user_name: String,
  user_display_name: String,
  user_id: String,
  user_type: String,
  'badge-info': Object,
  badges: Object,
  color: String,
  flags: Object,
  is_subscriber: Boolean,
  is_turbo: Boolean,
  is_mod: Boolean,
  inherited_by_channel: mongoose.Types.ObjectId,
});

const Message = {
  Shema: messageShema,
  Model: mongoose.model('Message', messageShema),
};

exports.Message = Message;
