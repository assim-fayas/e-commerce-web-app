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



//products

user_route.get('/products', productController.viewProduct)
user_route.get('/singleProduct',productController.singleProduct)
// user_route.post('/search-product', productController.search_product)



module.exports = user_route;