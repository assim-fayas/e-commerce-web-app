const mongoose = require('mongoose')
const brandSchema = new mongoose.Schema({
    image: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Brand', brandSchema)