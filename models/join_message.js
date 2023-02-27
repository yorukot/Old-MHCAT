const mongoose = require('mongoose');

const join_message = new mongoose.Schema({
    guild: String,
    message_content: String,
    color: String,
    channel: String,
    img: String,
});

module.exports = new mongoose.model('join_message', join_message)