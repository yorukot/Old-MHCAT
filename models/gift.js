const mongoose = require('mongoose');

const gift = new mongoose.Schema({
    guild: String,
    gift_name: String,
    gift_code: String,
    gift_chence: Number,
});

module.exports = new mongoose.model('gift', gift)