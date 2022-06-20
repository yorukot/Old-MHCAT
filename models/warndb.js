const mongoose = require('mongoose')
const warndb = new mongoose.Schema({
    time: String,
    guild: String,
    user: String,
    content: Array
})

module.exports = mongoose.model("warndb", warndb);