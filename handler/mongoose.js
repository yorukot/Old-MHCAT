const { mongooseConnectionString } = require("../config.json");
const mongoose = require("mongoose");

module.exports = () => {
    if (!mongooseConnectionString) return;

    mongoose.connect(mongooseConnectionString, {
        useFindAndModify: true,
        useUnifiedTopology: true,
    })
}; // The code is in my github

// Now make a modules folder, here all data thing will be stored

// As you can see there it no error...
// That is all for today I hoped it helped
// one more thing u can put the code even in index.js