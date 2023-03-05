const express = require("express")

const admin_route = express();

const session = require("express-session");
const config = require("../config/config");
admin_route.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    resave: false
}))

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

admin_route.get('/users', adminController.loadusers)
admin_route.get('/user-block', adminController.blockUser)
admin_route.get('/orders', adminController.loadOrder)
admin_route.get('/category', adminController.loadCatagory)
admin_route.get('/products', adminController.loadProduct)
admin_route.get('/coupen', adminController.loadCoupen)



admin_route.get('*', (req, res) => {
    res.redirect('/admin')
})



module.exports = admin_route;