const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ws-chat', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => console.log('---------------- Connected to MongoDB : ) ----------------'))
    .catch(error => console.log(error))

// Mongoose Models
const Chat = require('./models/chat.js');

module.exports = Chat;