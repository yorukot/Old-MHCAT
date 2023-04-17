const mongoose = require('mongoose');

const join_message = new mongoose.Schema({
    guild: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    enable: {
        type: SchemaTypes.Boolean,
        required: true,
        unique: true,
    },
    message_content: {
        type: SchemaTypes.String,
        required: true,
    },
    color: {
        type: SchemaTypes.String,
        required: true,
    },
    channel: {
        type: SchemaTypes.String,
        required: true,
    },
    img: {
        type: SchemaTypes.String,
    },
});

module.exports = new mongoose.model('join_message', join_message)