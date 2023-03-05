const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim:true
    },
    Email: {
        type: String,
        required: true,
        trim:true
    },
    Password: {
        type: String,
        required: true,
        trim:true
    },
    Mobile: {
        type: String,
        required: true,
        trim:true
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