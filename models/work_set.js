const mongoose = require('mongoose')
const work_set = new mongoose.Schema({
    guild: String,
    get_energy: Number,
    max_energy: Number,
})

module.exports = mongoose.model("work_set", work_set);