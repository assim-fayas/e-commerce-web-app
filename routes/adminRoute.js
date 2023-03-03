const express = require("express")

const admin_route = express();

const session = require("express-session");
const config = require("../config/config");
admin_route.use(session({ secret: config.sessionSecret }))

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin')

const adminController = require("../controllers/adminController")

admin_route.get('/', adminController.loadadminLogin)
admin_route.post('/', adminController.verifyLogin)
admin_route.get('/home', adminController.loadDashboard)
admin_route.get('/logout', adminController.logout)

admin_route.get('/users', adminController.loadusers)
admin_route.get('/orders', adminController.loadOrder)
admin_route.get('/category', adminController.loadCatagory)
admin_route.get('/products', adminController.loadProduct)
admin_route.get('/coupen', adminController.loadCoupen)



admin_route.get('*', (req, res) => {
    res.redirect('/admin')
})



module.exports = admin_route;