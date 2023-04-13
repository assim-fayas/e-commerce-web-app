const User = require('../model/userModel');
const Products = require('../model/productModel')
const Order = require('../model/orderModel')
const Category = require('../model/categoryModel')
const Coupon = require('../model/coupenModel')
const Brand = require('../model/brandModel')
const Banner = require('../model/bannerModel')
const bcrypt = require('bcrypt');



const loadadminLogin = async (req, res) => {
    try {

        res.render('adminLogin');

    }

    catch (error) {
        console.log(  res.render('admin/500'))
        console.log(error.message);
       
    }
}


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;


        const userData = await User.findOne({ Email: email });

        if (userData) {
            console.log(userData);
            const passwordMatch = await bcrypt.compare(password, userData.Password);
            if (passwordMatch) {
                console.log(passwordMatch);
                if (userData.is_Admin === 0) {
                    res.render('adminLogin', { message: "Email and password is incorrect" })
                }
                else {
                    req.session.admin_id = userData._id;
                    res.redirect("/admin/home")
                }


            } else {
                res.render('adminLogin', { message: "Email and password ids incorrect" })
            }
        }
        else {
            res.render('adminLogin', { message: "Email and password ids incorrect" })
        }

    } catch (error) {
        console.log(  res.render('admin/500'))
        console.log(error.message);
    }

}




const loadDashboard = async (req, res) => {
    try {
        let todayDate = new Date().toLocaleDateString()
        let totalOrders = await Order.find({}).count()
        let totalDelivery = await Order.find({ orderStatus: "Delivered" }).count()
        let totalProduct = await Products.find({}).count()
        let totalCategory = await Category.find({}).count()
        let totalBrand = await Brand.find({}).count()
        let totalUsers = await User.find({}).count()
        let totalCoupon = await Coupon.find({}).count()
        let totalbanner = await Banner.find({}).count()
        const online = await Order.find({ paymentMethod: 'card' }).count()
        const cod = await Order.find({ paymentMethod: 'COD' }).count()
        const wallet = await Order.find({ paymentMethod: 'Wallet' }).count()


        const weeklyRevenueOf = await Order.aggregate([
            {
                $match:{
                    date:{
                        $gte:new Date(new Date().setDate(new Date().getDate()-7))
                    },orderStatus:{
                        $eq:'Delivered'
                    }
                }
            },
            {
                $group:{
                    _id:null,
                    Revenue:{$sum:'$totalAmount'}
                }
            }
        ]);
        const weeklyRevenue = weeklyRevenueOf.map((item) => {
            return item.Revenue
        });
        const weeklySales = await Order.aggregate([
            {
                $match:{
                    orderStatus:{
                        $eq:'Delivered'
                    }
                }
            },
            {
                $group:{
                    _id:
                        { $dateToString:{ format : "%d-%m-%Y", date: "$date"}},
                    sales:{$sum:"$totalAmount"}
                }
            },
            {
                $sort:{_id:1}
            },
            {
                $limit:7
            },
            
        ])
        const date = weeklySales.map((item) => { 
            return item._id
        })
        const Sales = weeklySales.map((item) => { 
            return item.sales
        })

        res.render('home', { todayDate, totalOrders, totalDelivery, totalProduct, totalCategory, totalBrand, totalUsers, totalCoupon, totalbanner,weeklyRevenue,online,cod, wallet,weeklySales,date,Sales  })
    } catch (error) {
        console.log(  res.render('admin/500'))
        console.log(error.message);

    }
}

// admin logout

const logout = async (req, res) => {
    try {
        req.session.admin_id = false;
        res.redirect('/admin')
    } catch (error) {
        console.log(  res.render('admin/500'))
        console.log(error.messag);
    }
}



//users  management 

const loadusers = async (req, res) => {
    try {
        const users = await User.find({ is_Admin: 0 })

        res.render('users', { users });



    } catch (error) {
        console.log(  res.render('admin/500'))
        console.log(error.message);
    }
}

const blockUser = async (req, res) => {
    try {
        // console.log(req.query.id)
        const id = req.body.userId
        console.log("block id",id);
        const users = await User.findOne({ _id: id }, { block: 1, _id: id })

        if (users.block === false) {
            const blockuser = await User.updateOne({ _id: id }, { $set: { block: true } })
            req.session.user_id = true
            res.redirect('/admin/users')
            res.json({result:true})
        }
        else {
            const blockuser = await User.updateOne({ _id: id }, { $set: { block: false } })
            req.session.user_id = false
            res.redirect('/admin/users')
            res.json({result:true})
        }

    } catch (error) {
        console.log(  res.render('admin/500'))
        console.log(error.message);
    }
}






module.exports = {
    loadadminLogin,
    verifyLogin,
    loadDashboard,
    logout,
    loadusers,
    blockUser,

}