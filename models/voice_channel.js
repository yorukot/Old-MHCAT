const mongoose = require('mongoose');

const voice_channel = new mongoose.Schema({
    guild: String,
    ticket_channel: String,
    limit: Number,
    name: String,
    parent: String
});

module.exports = new mongoose.model('voice_channel', voice_channel)