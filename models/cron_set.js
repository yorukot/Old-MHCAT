const mongoose = require('mongoose');

const cron_set = new mongoose.Schema({
    cron: String,
    guild: String,
    channel: String,
    id: String,
    message: Array,
});

module.exports = new mongoose.model('cron_set', cron_set)