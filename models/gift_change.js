const mongoose = require('mongoose');

const gift_change = new mongoose.Schema({
    guild: String,
    coin_number: Number,
    sign_coin: Number,
    channel: String,
});

module.exports = new mongoose.model('gift_change', gift_change)