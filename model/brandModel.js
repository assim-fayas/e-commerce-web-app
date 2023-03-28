const mongoose = require('mongoose')
const brandSchema = new mongoose.Schema({
    image: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    disable: {
        type: Boolean,
        default: false
    }
})  

module.exports = mongoose.model('Brand', brandSchema)