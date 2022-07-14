const mongoose = require('mongoose');

const coin = new mongoose.Schema({
    guild: String,
    member: String,
    coin: Number,
    today: Boolean,
});

module.exports = new mongoose.model('coin', coin)