const express = require("express")

const admin_route = express();

const session = require("express-session");
const config = require("../config/config");
const nocache = require('nocache')
admin_route.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
    resave: false
}))
admin_route.use(nocache())
const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin')

const adminController = require("../controllers/adminController")

const auth = require("../middleware/adminAuth")


admin_route.get('/', auth.isLogout, adminController.loadadminLogin)
admin_route.post('/', adminController.verifyLogin)
admin_route.get('/home', auth.isLogin, adminController.loadDashboard)
admin_route.get('/logout', auth.isLogin, adminController.logout)

admin_route.get('/users', auth.isLogin, adminController.loadusers)
admin_route.get('/user-block', adminController.blockUser)
admin_route.get('/orders', auth.isLogin, adminController.loadOrder)
admin_route.get('/category', auth.isLogin, adminController.loadCatagory)
admin_route.get('/products', auth.isLogin, adminController.loadProduct)
admin_route.get('/coupen', auth.isLogin, adminController.loadCoupen)



admin_route.get('*', (req, res) => {
    res.redirect('/admin')
})



module.exports = admin_route;