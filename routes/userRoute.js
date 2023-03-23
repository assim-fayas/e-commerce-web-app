const express = require("express");
const user_route = express();
const session = require("express-session");
const config = require("../config/config");
const nocache = require('nocache')

user_route.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
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

user_route.get('/profile',auth.isLogin,userController.userprofile)
user_route.post('/updateProfile',auth.isLogin,userController.updateProfile)

//address
user_route.post('/add-address',userController.addAddress)
user_route.get('/address',auth.isLogin,userController.viewAddress)
user_route.get('/edit-address/:id/:adrsId',auth.isLogin,userController.editaddress)
user_route.post('/edit-update-address/:addressIndex',auth.isLogin,userController.updateAddress)
user_route.get('/delete-address/:id/:adrsId',auth.isLogin,userController.DeleteAddress)


//products

user_route.get('/products',auth.isLogin, productController.viewProduct)
user_route.get('/singleProduct',auth.isLogin,productController.singleProduct)
// user_route.post('/search-product', productController.search_product)




// wishlist

user_route.get('/wishlist',auth.isLogin,productController.loadWishlist)
user_route.post('/addtowhishlist',auth.isLogin,productController.AddTowishlist)
user_route.post('/deletewhishlist',auth.isLogin,productController.deletewhishlist)


// cart
user_route.get('/cart',auth.isLogin,productController.loadCart)
user_route.post('/addtocart',auth.isLogin,productController.addtoCart)
user_route.post('/deleteCart',auth.isLogin,productController.deleteCart)
user_route.post('/change-quantity',auth.isLogin,productController.change_Quantities)


//checkout
user_route.get('/checkout',auth.isLogin,productController.loadCheckout)




module.exports = user_route;