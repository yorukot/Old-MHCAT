const mongoose = require('mongoose');

const logging = new mongoose.Schema({
    guild: String,
    channel_id: String,
});

module.exports = new mongoose.model('logging', logging)