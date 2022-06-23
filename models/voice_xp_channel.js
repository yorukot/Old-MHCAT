const mongoose = require('mongoose');

const voice_xp_channel = new mongoose.Schema({
    guild: String,
    channel: String,
    background: String,
    color: String,
});

module.exports = new mongoose.model('voice_xp_channel', voice_xp_channel)