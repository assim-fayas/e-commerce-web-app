const mongoose = require('mongoose')

const coupenData = new mongoose.Schema({
    Coupencode: {
        type: String,
        required: true
    },
    coupenAmountType: {
        type: String,
        required: true
    },
    coupenAmount: {
        type: Number,
        required: true
    },
    minCartAmount: {
        type: Number,

    },
    minRedeemAmount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    },
    limit: {
        type: Number,
        required: true
    },
    used: {
        type: Array
    },
    disable: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
module.exports = mongoose.model('Coupon', coupenData)