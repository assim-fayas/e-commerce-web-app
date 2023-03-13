const mongoose = require('mongoose')

const coupenData = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    discount_Type: {
        type: String,
        enum: ['percentage', 'flat']
    },
    discountAmount: {
        type:String
    },
    maxDiscountamount: {
        type: Number,
        required: true
    },
    mainPurchase: {
        type: Number,
        required: true
    },
    createdAt: {
        type: String
    },
    expiryDate: {
        type: String
    }
}, { timestamps: true })
module.exports = mongoose.model('Coupon', coupenData)