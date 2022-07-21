const { mongooseConnectionString } = require("../config.json");
const mongoose = require("mongoose");

module.exports = () => {
    if (!mongooseConnectionString) return;

    mongoose.connect(mongooseConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false    
    })
};