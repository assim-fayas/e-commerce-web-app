const express = require("express")

const admin_route = express();

const session = require("express-session");
const config = require("../config/config");
const nocache = require('nocache')
admin_route.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
    resave: false
}))
admin_route.use(nocache())
const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

admin_route.set('views', './views/admin');
admin_route.set('view engine', 'ejs');
const multer = require("multer");
const path = require('path')

const categorystorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/categoryImage'));
    },

    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }

});
const upload = multer({ storage: categorystorage });
const brandStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/brandImage'));
    },

    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }

});
const uploadBrand = multer({ storage: brandStorage });
const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/productImage'));
    },

    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
})
const uploadProduct = multer({ storage: productStorage })
const bannerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/bannerImage'));
    },

    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
})


const uploadBanner = multer({ storage: bannerStorage })
const adminController = require("../controllers/adminController")
const categoryController = require("../controllers/categoryController")
const productController = require("../controllers/productController")
const brandController = require("../controllers/brandController")
const couponController = require("../controllers/couponController")
const bannerController = require("../controllers/bannerController")
const orderController=require("../controllers/orderController")
const auth = require("../middleware/adminAuth")

// admin adminController
admin_route.get('/', auth.isLogout, adminController.loadadminLogin)
admin_route.post('/', adminController.verifyLogin)
admin_route.get('/home', auth.isLogin, adminController.loadDashboard)
admin_route.get('/logout', auth.isLogin, adminController.logout)
admin_route.get('/users', auth.isLogin, adminController.loadusers)
admin_route.delete('/user-block', adminController.blockUser)

// category controller
admin_route.get('/category', auth.isLogin, categoryController.loadCatagory)
admin_route.post('/addCategory', upload.single('image'), categoryController.insertMaincategory)
admin_route.get('/addCategory', auth.isLogin, categoryController.loadAddcategory)
admin_route.get('/edit-category', auth.isLogin, categoryController.editCategory)
admin_route.post('/edit-category', categoryController.updateCategory)
admin_route.delete('/delete-category', auth.isLogin, categoryController.deleteCategory)
admin_route.get('/addSubCategory', auth.isLogin, categoryController.addSubcategory)
admin_route.post('/addSubCategory', categoryController.insertsubCategory)
admin_route.post('/addimage', upload.single('image'), categoryController.updateImage)

//brand controller
admin_route.get('/brand', auth.isLogin, brandController.loadBrand)
admin_route.get('/addBrand', auth.isLogin, brandController.addBrand)
admin_route.post('/addBrand', uploadBrand.single('image'), brandController.insertBrand)
admin_route.delete('/disable-brand', auth.isLogin, brandController.disableBrand)
admin_route.get('/edit-brand', auth.isLogin, brandController.editBrand)
admin_route.post('/edit-brand', brandController.updateBrand)
admin_route.post('/addimage-brand', uploadBrand.single('image'), brandController.updateImage)

// product controller
admin_route.get('/products', auth.isLogin, productController.loadProduct)
admin_route.get('/addProduct', auth.isLogin, productController.addProduct)
admin_route.post('/addProduct', uploadProduct.array('image', 4), productController.insertProduct)
admin_route.get('/editProduct', auth.isLogin, productController.editProduct)
admin_route.post('/editProduct', productController.updateProduct)
admin_route.delete('/disable-product', auth.isLogin, productController.disable)

//copen controller
admin_route.get('/coupen', auth.isLogin, couponController.loadCoupen)
admin_route.get('/addCoupen', auth.isLogin, couponController.addCoupen)
admin_route.post('/addCoupen', couponController.insertCoupen)
admin_route.get('/editCoupen', auth.isLogin, couponController.editCoupen)
admin_route.post('/editCoupen', couponController.updateCoupen)
admin_route.delete('/disable-coupen', couponController.disableCoupen)

// banner
admin_route.get('/banner', auth.isLogin, bannerController.loadbanner)
admin_route.get('/addbannerCaro', auth.isLogin, bannerController.loadBannerCaro)
admin_route.post('/addbannerCaro', uploadBanner.array('image', 4), bannerController.insertBannerCaro)
admin_route.get('/editBanner', auth.isLogin, bannerController.editBanner)
admin_route.delete('/blockBanner', auth.isLogin, bannerController.blockbanner)

//orders
admin_route.get('/orders',auth.isLogin,orderController.loadOrder)
admin_route.get('/order-status-placed',auth.isLogin,orderController.orderPlaced)
admin_route.get('/order-status-shipped',auth.isLogin,orderController.orderShipped)
admin_route.get('/order-status-delivered',auth.isLogin,orderController.orderDelivered)
admin_route.get('/order-status-rejectRerturn',auth.isLogin,orderController.rejectReturn)
admin_route.get('/order-status-acceptReturn',auth.isLogin,orderController.acceptReturn)
admin_route.get('/orderPreview',auth.isLogin,orderController.orderView)

//sales Report
admin_route.get('/salesReport',auth.isLogin,orderController.salesReport)
admin_route.post('/salesReport',orderController.ViewSalesReport)

admin_route.get('*', (req, res) => {
    res.redirect('/admin')
})



module.exports = admin_route;