const Products=require("../model/productModel")


//product management


const loadProduct = async (req, res) => {
    try {
        res.render('product')
    } catch (error) {
        console.log(error.message);
    }
}
const addProduct=async(req,res)=>{
    try {
        res.render('addProduct')
    } catch (error) {
        console.log(error.message);
    }
}


// const insertProduct=async(req,res)=>{
// try {
//     const productData= {
//        image: req.file.filename,
//        product_name:req.body.name,
//        category:req.body.
//     }
// } catch (error) {
//     console.log(error.message);
// }

// }
module.exports = {
    loadProduct,
    addProduct,
    // insertProduct
}