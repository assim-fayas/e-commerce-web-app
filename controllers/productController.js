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


// const search_product = async (req, res) => {
//     try {
//         var cataId = req.query.sort;
//         console.log("cataid only");
//         if (req.query.cataId) {
//             const search = req.body.search
//             const ss = new RegExp(search, 'i')
//             const data = await Products.find({ productName: ss, subCategory: req.query.cataId })
//             const cata = await Category.find()
//             res.render('products', { data, cata, search: search, cataId: req.query.cataId })
//         } else if (req.query.sort) {
//             console.log("sort", req.query.sort);
//             const search = req.body.search
//             const ss = new RegExp(search, 'i')
//             const data = await Products.find({ productName: ss }).sort({ price: req.query.sort })
//             const cata = await Category.find()
//             console.log(data);
//             res.render('products', { data, cata, search: search, sort: req.query.sort })
//         } else if (req.query.cataId && req.body.search) {
//             console.log("cata search");
//             const search = req.body.search
//             const ss = new RegExp(search, 'i')
//             const data = await Products.find({ productName: ss })
//             const cata = await Category.find()
//             res.render('products', { data, cata, search: search, cataId: req.query.cataId })
//         }
//         else {
//             const search = req.body.search
//             const ss = new RegExp(search, 'i')
//             const cata = await Category.find()
//             const data = await Products.find({ productName: ss })
//             res.render('products', { data, cata, search:search})

//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }
 const singleProduct=async(req,res)=>{
try {
    const productId=req.query.id;
    const productData = await Products.findById({_id:productId})
    console.log(productData);
    res.render('singleProduct',{productData})
} catch (error) {
    console.log(error.message);
}
 }
module.exports = {
    loadProduct,
    addProduct,
    insertProduct,
    viewProduct,
    singleProduct
}