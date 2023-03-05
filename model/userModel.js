const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Mobile: {
        type: String,
        required: true
    },

    is_Admin: {
        type: Number,
        default: 0
    },
    is_Verified: {
        type: Number,
        default: 0
    },
    token: {
        type: String,
        default: ''
    },
    block: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);