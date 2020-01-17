const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
      sender_id: String,
      author: String,
      message: String,
      timestamp: Number,
      edited: Boolean
})

module.exports = mongoose.model('messages', MessagesSchema);