const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: true
    },
    image: {
        type: Array,
        require: true
    },
    subCategory: {
        type: String,
        require: true

    },
    mainCategory:{
        type:String,
        require:true
    },
    brand:{
        type:String,
        require:true
    },
    description: {
        type: String,
        require: true
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