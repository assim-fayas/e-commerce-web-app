const { string } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        trim: true
    },
    Password: {
        type: String,
        required: true,
        trim: true
    },
    Mobile: {
        type: String,
        required: true,
        trim: true
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
    },
    whishlist: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            requried: true
        }
    }],
    cart: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String
        },
        price: {
            type: Number
        },
        qty: {
            type: Number,
            required: true,
            default: 1
        },
        productTotalPrice: {
            type: Number,
            required: true
        },
    }],
    cartTotalPrice: {
        type: Number,
        // default:0
    },
    wallet:{
        type:Number,
    }

}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);