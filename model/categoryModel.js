const mongoose = require('mongoose')



const subcategorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    mainCategory: {
        type: String,
        required: true
    }



})


const maincategorySchema = new mongoose.Schema({
    image: {
        type: String,

    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    subCategories: [subcategorySchema],
    description: {
        type: String

    }
}, { timestamps: true });


module.exports = mongoose.model('Category', maincategorySchema);