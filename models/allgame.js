const mongoose = require('mongoose');

const allgame = new mongoose.Schema({
    game: String,
    minutes: String,
});

module.exports = new mongoose.model('allgame', allgame)