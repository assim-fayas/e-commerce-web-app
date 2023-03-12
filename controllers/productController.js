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
        res.render('addProduct', { category, brand })
    } catch (error) {
        console.log(error.message);
    }
}


const insertProduct = async (req, res) => {
    try {
        const productData = new Products({
            image: req.file.filename,
            product_name: req.body.name,
            brand: req.body.Brand,
            subCategory: req.body.subCategory,
            mainCategory: req.body.MainCategory,
            size: req.body.size,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description

        })
        const Product = await productData.save()
        if(Product){
            res.redirect('/admin/products')
        console.log(productData);
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