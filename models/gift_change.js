const mongoose = require('mongoose');

const gift_change = new mongoose.Schema({
    guild: String,
    coin_number: Number,
});

module.exports = new mongoose.model('gift_change', gift_change)