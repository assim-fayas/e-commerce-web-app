const Products = require("../model/productModel")
const Category = require("../model/categoryModel")
const Brand = require("../model/brandModel")


//product management


const loadProduct = async (req, res) => {
    try {
        res.render('product')
    } catch (error) {
        console.log(error.message);
    }
}
const addProduct = async (req, res) => {
    try {
        const category = await Category.find({})
        const brand = await Brand.find({})
        res.render('addProduct', {category, brand})
    } catch (error) {
        console.log(error.message);
    }
}


const insertProduct = async (req, res) => {
    try {
        const productData = {
            image: req.file.filename,
            product_name: req.body.name,
            category: req.body.category
        }
    } catch (error) {
        console.log(error.message);
    }

}
module.exports = {
    loadProduct,
    addProduct,
    insertProduct
}