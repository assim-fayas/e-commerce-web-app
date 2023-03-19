const Products = require("../model/productModel")
const Category = require("../model/categoryModel")
const Brand = require("../model/brandModel");
const User = require("../model/userModel");




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

        const productData = await Products.find({ disable: false })
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
const singleProduct = async (req, res) => {
    try {
        const productId = req.query.id;
        const productData = await Products.findById({ _id: productId })
        console.log(productData);
        res.render('singleProduct', { productData })
    } catch (error) {
        console.log(error.message);
    }
}

const editProduct = async (req, res) => {
    try {
        Id = req.query.id
        const category = await Category.find({})
        const brand = await Brand.find({})
        const product = await Products.findById({ _id: Id })
        res.render('editProduct', { category, brand, product })
    } catch (error) {
        console.log(error.message);
    }
}

//  update product
const updateProduct = async (req, res) => {

    const id = req.query.id;
    console.log(req.query.id);
    console.log(req.body);
    const updateProduct = await Products.findByIdAndUpdate(id, {
        $set: {
            productName: req.body.name,
            brand: req.body.Brand,
            subCategory: req.body.subCategory,
            mainCategory: req.body.MainCategory,
            size: req.body.size,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description


        }
    })
    if (updateProduct) {
        res.redirect('/admin/products')
    }
}



//disable and enabling product 
const disable = async (req, res) => {
    try {
        const Id = req.query.id
        const Disable = await Products.findOne({ _id: Id }, { disable: 1, _id: Id })
        console.log(Disable);
        if (Disable.disable === true) {
            const disable = await Products.findByIdAndUpdate({ _id: Id }, { $set: { disable: false } })
            res.redirect('/admin/products')
        }
        else {
            const enable = await Products.findByIdAndUpdate({ _id: Id }, { $set: { disable: true } })

            res.redirect('/admin/products')
        }
    } catch (error) {
        console.log(error.message);
    }
}



//wishlist

const loadWishlist = async (req, res) => {
    try {
        const Id = await req.session.user_id
        const userData = await User.findOne({ _id: Id }).populate('whishlist.product').exec()
        console.log(userData);
        res.render('wishlist', { userData })
    } catch (error) {
        console.log(error.message);
    }
}

const AddTowishlist = async (req, res) => {

    try {

        const productId = req.body.productId

        let exist = await User.findOne({ id: req.session.user_id, 'whishlist.product': productId })


        if (exist) {
            console.log(exist, "wishlist existtttttttttt");
            res.json({ status: false })
        } else {

            const product = await Products.findOne({ _id: req.body.productId })
            const _id = req.session.user_id
            console.log("user");
            const userData = await User.findOne({ _id })


            const result = await User.updateOne({ _id }, { $push: { whishlist: { product: product._id } } })
            console.log(result);
            if (result) {
                res.json({ status: true })
                console.log('its done');


            } else {

                console.log('not added to whishlist ');
            }
        }

    } catch (error) {
        console.log(error.message);

        console.log('error from addtowishlist');
    }
}

const deletewhishlist = async (req, res) => {

    try {
        const id = req.session.user_id
        const deleteProId = req.body.productId
        const deleteWishlist = await User.findByIdAndUpdate({ _id: id }, { $pull: { whishlist: { product: deleteProId } } })

        if (deleteWishlist) {

            res.json({ success: true })
        }
    } catch (error) {
        console.log(error.message);
    }
}


//cart

const loadCart = async (req, res) => {
    try {
        res.render('cart')
    } catch (error) {
        console.log(error.message);
    }
}




const addtoCart = async (req, res) => {
    try {
        console.log("inside add to cart");
        const proId = req.body.productId;
       const userid = req.session.user_id;
        let existed = await User.findOne({ _id: userid, 'cart.productId': proId })
        // console.log(exist ,"existed product id");

        if (existed) {
            console.log(existed, "already existed");
            res.json({ status: false })
        }
        else {
            console.log("product added to cart");
            const product = await Products.findOne({ _id: req.body.productId })
            const userId = req.session.user_id
            const user = await User.findOne({_id:userId })
            console.log(user);
            const productAdd = await User.updateOne({ _id:user }, { $push: { cart: { productId: product.userId } } })
            console.log(productAdd);

            if (productAdd) {
                res.json({ status: true })
            }
            else {

                console.log('not added to whishlist ');
            }

        }
    } catch (error) {

        console.log(error.message);
    }
}


module.exports = {
    loadProduct,
    addProduct,
    insertProduct,
    viewProduct,
    singleProduct,
    editProduct,
    updateProduct,
    disable,
    loadWishlist,
    AddTowishlist,
    deletewhishlist,
    loadCart,
    addtoCart

}