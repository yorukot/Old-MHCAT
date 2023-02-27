const mongoose = require('mongoose');

const btn = new mongoose.Schema({
    guild: String,
    number: String,
    role: String
});

module.exports = new mongoose.model('btn', btn)