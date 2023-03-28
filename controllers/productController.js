const Products = require("../model/productModel")
const Category = require("../model/categoryModel")
const Brand = require("../model/brandModel");
const User = require("../model/userModel");
const Address = require("../model/addressModel");
const mongoose = require('mongoose')
const { findOneAndUpdate } = require("../model/productModel");




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

        Id = req.session.user_id
        const temp = mongoose.Types.ObjectId(req.session.user_id)
        const usercart = await User.aggregate([{ $match: { _id: temp } }, { $unwind: '$cart' }, { $group: { _id: null, totalcart: { $sum: '$cart.productTotalPrice' } } }])
        if (usercart.length > 0) {
            const cartTotal = usercart[0].totalcart
            // console.log(cartTotal);
            const cartTotalUpdate = await User.updateOne({ _id: Id }, { $set: { cartTotalPrice: cartTotal } })
            const userData = await User.findOne({ _id: Id }).populate('cart.productId').exec()
            res.render('cart', { userData })
            console.log("product dattaaaaaaaaa");
        }
        else {
            const userData = await User.findOne({ Id })
            res.render('cart', { userData })
        }

    } catch (error) {
        console.log(error.message);
    }
}




const addtoCart = async (req, res) => {
    try {
        console.log("inside add to cart");
        const proId = req.body.productId;
        // console.log(proId);
        const userid = req.session.user_id;
        // console.log(userid);


        let existed = await User.findOne({ id: userid, 'cart.productId': proId })
        console.log(existed, "existed product id");

        if (existed) {

            res.json({ status: false })
        }
        else {

            const product = await Products.findOne({ _id: req.body.productId })
            console.log(product, "pro");
            const userId = req.session.user_id
            const user = await User.findOne({ _id: userId })
            const productAdd = await User.updateOne({ _id: user }, { $push: { cart: { productId: product._id, qty: 1, price: product.price, productTotalPrice: product.price } } })
            console.log(productAdd, "add");

            if (productAdd) {
                res.json({ status: true })
                console.log("added success fully");
            }
            else {

                console.log('not added to whishlist ');
            }

        }
    } catch (error) {

        console.log(error.message);
    }
}



const deleteCart = async (req, res) => {
    try {
        console.log("delete cart");
        const Id = req.body.productId
        console.log(Id);
        const userId = req.session.user_id
        const deleteCart = await User.findOneAndUpdate({ _id: userId }, { $pull: { cart: { productId: Id } } })

        if (deleteCart) {
            res.json({ success: true })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const change_Quantities = async (req, res) => {
    try {
        console.log("inside cjange quantity");
        const { user, product, count, Quantity, proPrice } = req.body
        const producttemp = mongoose.Types.ObjectId(product)
        const usertemp = mongoose.Types.ObjectId(user)
        const updateQTY = await User.findOneAndUpdate({ _id: usertemp, 'cart.productId': producttemp }, { $inc: { 'cart.$.qty': count } })

        const currentqty = await User.findOne({ _id: usertemp, 'cart.productId': producttemp }, { _id: 0, 'cart.qty.$': 1 })

        const qty = currentqty.cart[0].qty
        console.log(qty);

        const productSinglePrice = proPrice * qty


        await User.updateOne({ _id: usertemp, 'cart.productId': producttemp }, { $set: { 'cart.$.productTotalPrice': productSinglePrice } })
        const cart = await User.findOne({ _id: usertemp })
        let sum = 0
        for (let i = 0; i < cart.cart.length; i++) {
            sum = sum + cart.cart[i].productTotalPrice
            console.log(sum);
        }

        const update = await User.updateOne({ _id: usertemp }, { $set: { cartTotalPrice: sum } })

            .then(async (response) => {

                res.json({ response: true, productSinglePrice, sum })
            })
    } catch (error) {
        console.log(error.message);
    }
}


//checkout

const loadCheckout = async (req, res) => {
    try {
        Id = req.session.user_id;
        const addressData = await Address.findOne({ userAddress: Id })
        const userData = await User.findOne({ _id: Id }).populate('cart.productId').exec()

        res.render('checkout', { addressData, userData })
    } catch (error) {
        console.log(error.message);
    }
}




const checkoutaddAddress = async (req, res) => {
    try {

        console.log("inside checkout address");
        if (req.session.user_id) {

            Id = req.session.user_id;
            console.log(Id);



            const AddressObj = {

                fullname: req.body.fullname,
                mobileNumber: req.body.number,
                pincode: req.body.zip,
                houseAddress: req.body.houseAddress,
                streetAddress: req.body.street,
                landMark: req.body.landmark,
                cityName: req.body.city,
                state: req.body.state
            }



            const userAddress = await Address.findOne({ userId: Id })
            if (userAddress) {
                console.log("addred to exist address");
                const userAdrs = await Address.findOne({ userId: Id }).populate('userId').exec()
                // console.log(userAdrs);
                userAdrs.userAddresses.push(AddressObj)
                await userAdrs.save().then((resp) => {
                    res.redirect('/checkout')
                }).catch((err) => {
                    res.send(err)
                })
                console.log(userAdrs);

            } else {
                console.log("added to new address ");
                let userAddressObj = {
                    userId: Id,
                    userAddresses: [AddressObj]
                }
                await Address.create(userAddressObj).then((resp) => {
                    res.redirect('/checkout')
                })
            }

        }
    } catch (error) {
        console.log(error.message);
    }
}



const placeOrder = async (req, res) => {
    try {
        // console.log("get place order");
        const userId = req.session.user_id
        const index = req.body.address
        console.log(req.body.couponDiscount);
        console.log(req.body.total1);
        console.log(req.body.couponC);

        const discount = req.body.couponDiscount
        const totel = req.body.total1
        const coupon = req.body.couponC
        const couponUpdate = await Coupon.updateOne({ couponCode: coupon }, { $push: { used: userId } })
        console.log(couponUpdate);

        console.log(index);

        const address = await Address.findOne({ userId: userId })
        const userAddress = address.userAddresses[index]
        // console.log(userAddress);
        const cartData = await User.findOne({ _id: userId }).populate('cart.productId')
        const total = cartData.cartTotalPrice
        // console.log(cartData);
        const payment = req.body.payment
        // console.log(payment);
        let status = payment === 'COD' ? 'placed' : 'pending'
        let orderObj = {
            userId: userId,
            address: {
                fullName: userAddress.fullname,
                mobileNumber: userAddress.mobileNumber,
                pincode: userAddress.pincode,
                houseAddress: userAddress.houseAddress,
                streetAddress: userAddress.streetAddress,
                landMark: userAddress.landMark,
                cityName: userAddress.cityName,
                state: userAddress.state
            },
            paymentMethod: payment,
            orderStatus: status,
            items: cartData.cart,
            totalAmount: total,
            discount: discount
        }
        await Order.create(orderObj)
            .then(async (data) => {
                const orderId = data._id.toString()
                if (payment == 'COD') {
                    await User.updateOne({ _id: userId }, { $set: { cart: [], cartTotalPrice: 0 } })
                    console.log(data);
                    res.json({ status: true })
                } else {
                    var instance = new Razorpay({
                        key_id: process.env.KEY_ID,
                        key_secret: process.env.KEY_SECRET,
                    })
                    let amount = total
                    instance.orders.create({
                        amount: amount * 100,
                        currency: "INR",
                        receipt: orderId,
                    }, (err, order) => {
                        console.log(order);
                        res.json({ status: false, order })
                    })
                }
            })
    } catch (error) {
        console.log(error.message);
    }
}



       
const orderSuccess = async(req,res) => {
    try{
        const userId = req.session.user_id
        console.log(userId);
        const userData = await User.findOne({_id:userId})
        const catrData  = await User.findOne({_id:userId})
        const orderData = await Order.findOne({userId:userId}).populate({path:'items',populate:{path:'productId',model:'product'}}).sort({createdAt:-1}).limit(1)
        res.render('orderConfirmation',{orderData})

    }catch(error){
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
    addtoCart,
    deleteCart,
    change_Quantities,
    loadCheckout,
    checkoutaddAddress,
    placeOrder,
    orderSuccess

}