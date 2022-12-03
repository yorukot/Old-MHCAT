const mongoose = require('mongoose')
const work_set = new mongoose.Schema({
    get_energy: String,
    how_many_energy: String,
})

module.exports = mongoose.model("work_set", work_set);