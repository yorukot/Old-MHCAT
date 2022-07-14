const mongoose = require('mongoose');

const gift = new mongoose.Schema({
    guild: String,
    gift: String,
});

module.exports = new mongoose.model('gift', gift)