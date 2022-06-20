const mongoose = require('mongoose');

const playing = new mongoose.Schema({
    member: String,
    guild: String,
    game: Array
});

module.exports = new mongoose.model('playing', playing)