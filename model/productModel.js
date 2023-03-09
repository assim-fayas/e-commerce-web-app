const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        require: true

    },
    description: {
        type: String,
        require: true
    },
    stock: {
        type: Boolean,
        require: true
    },
    color:{
        type:Array,
        require:true
    },
    size:{
        type:Array,
        require:true
    },
    quantity: {
        type: Number,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date
    }
})
module.exports = mongoose.model('Product', productSchema)