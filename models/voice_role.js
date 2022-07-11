const mongoose = require('mongoose');

const voice_role = new mongoose.Schema({
    guild: String,
    leavel: String,
    role: String
});

module.exports = new mongoose.model('voice_role', voice_role)