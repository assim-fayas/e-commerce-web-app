const Products = require("../model/productModel")
const Category = require("../model/categoryModel")
const Brand = require("../model/brandModel")


//product management
const loadProduct = async (req, res) => {
    try {
        const products = await Products.find({});

        res.render('product', { products });
    } catch (error) {
        console.log(error.message);
    }
};

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
        const Images = []
        for (file of req.files) {
            Images.push(file.filename)
        }
        const productData = new Products({
            image: Images,
            productName: req.body.name,
            brand: req.body.Brand,
            subCategory: req.body.subCategory,
            mainCategory: req.body.MainCategory,
            size: req.body.size,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description

        })
        const Product = await productData.save()
        if (Product) {
            res.redirect('/admin/products')
            console.log(productData);
        }
    } catch (error) {
        console.log(error.message);
    }

}
const viewProduct = async (req, res) => {
    try {
        const productData = await Products.find({})
        res.render('products', { productData })
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    loadProduct,
    addProduct,
    insertProduct,
    viewProduct
}