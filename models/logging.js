const mongoose = require('mongoose');

const logging = new mongoose.Schema({
    guild: String,
    channel_id: String,
    message_update: Boolean,
    message_delete: Boolean
});

module.exports = new mongoose.model('logging', logging)