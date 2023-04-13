const express = require("express");
const user_route = express();
const session = require("express-session");
const config = require("../config/config");
const nocache = require('nocache')

user_route.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
    resave: false
}))
user_route.use(nocache())

const auth = require("../middleware/auth");

user_route.set('views', './views/users');
user_route.set('view engine', 'ejs');

const bodyParser = require('body-parser');
user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({ extended: true }))
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const couponController = require("../controllers/couponController");
const orderController = require("../controllers/orderController");



user_route.get('/register', auth.isLogout, userController.loadRegister);
user_route.post('/register', userController.insertUser);
user_route.get('/', auth.isLogout, userController.loginLoad)
user_route.get('/verify', userController.verifyMail);
user_route.get('/login', auth.isLogout, userController.loginLoad);
user_route.post('/login', userController.verifyLogin);
user_route.get('/home', auth.isLogin, userController.loadHome);
user_route.get('/logout', auth.isLogin, userController.userLogout);
user_route.get('/forgot', auth.isLogout, userController.forgetLoad);
user_route.post('/forgot', userController.forgetVerify);
user_route.get('/forget-password', auth.isLogout, userController.forgetpasswordload);
user_route.post('/forget-password', auth.isLogout, userController.resetPassword);

// login OTP
user_route.get('/loginOtp', userController.loginOtp)
user_route.post('/loginOtp', userController.verifyNum)
user_route.post('/loginOtpveryfy', userController.verifyNumOtp)

//profile
user_route.get('/profile', auth.isLogin, userController.userprofile)
user_route.post('/updateProfile', auth.isLogin, userController.updateProfile)

//address
user_route.post('/add-address', userController.addAddress)
user_route.get('/address', auth.isLogin, userController.viewAddress)
user_route.get('/edit-address/:id/:adrsId', auth.isLogin, userController.editaddress)
user_route.post('/edit-update-address/:addressIndex', auth.isLogin, userController.updateAddress)
user_route.get('/delete-address/:id/:adrsId', auth.isLogin, userController.DeleteAddress)

//products
user_route.get('/products', auth.isLogin, productController.viewProduct)
user_route.get('/singleProduct', auth.isLogin, productController.singleProduct)

// wishlist
user_route.get('/wishlist', auth.isLogin, productController.loadWishlist)
user_route.post('/addtowhishlist', auth.isLogin, productController.AddToWishlist)
user_route.post('/deletewhishlist', auth.isLogin, productController.deleteWishlistProduct)
user_route.post('/wishlistToCart',auth.isLogin,productController.wishlistToCart)

// cart
user_route.get('/cart', auth.isLogin, productController.loadCart)
user_route.post('/addtocart', auth.isLogin, productController.addtoCart)
user_route.post('/deleteCart', auth.isLogin, productController.deleteCart)
user_route.post('/change-quantity', auth.isLogin, productController.change_Quantities)

//checkout
user_route.get('/checkout', auth.isLogin, productController.loadCheckout)
user_route.post('/addCheckoutaddress', productController.checkoutaddAddress)

//apply coupen
user_route.post('/coupon-apply', couponController.couponApply)

//order
user_route.post('/place-order', productController.placeOrder)
user_route.post('/verify-payment', auth.isLogin, productController.verifyPayment)
user_route.get('/ordersuccess', auth.isLogin, productController.orderSuccess);
user_route.get('/orders', auth.isLogin, productController.OrderHistory);
user_route.get('/returnRequested', auth.isLogin, orderController.returnRequest)
user_route.get('/cancelRequest', auth.isLogin, orderController.cancelRequest)
user_route.get('/cancelreturnRequested', auth.isLogin, orderController.cancelreturnRequested)

// shop by category
user_route.get('/shopcategory',auth.isLogin,productController.shopCategory)







// user_route.use((req,res)=>{
//     res.status(404).render("404")
// })

module.exports = user_route;