const mongoose = require('mongoose')

const musicdata = new mongoose.Schema({
    guild: String,
    textchannel: String,
    voicechannel: String,
    song: Array,
    loop: Boolean,
    ps: Boolean,
    stopsec: Number,
})

module.exports = mongoose.model("musicdata", musicdata);