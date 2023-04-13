const Order = require('../model/orderModel')
const Product = require('../model/productModel')
const User = require('../model/userModel')


const loadOrder = async (req, res) => {
    try {
        orderList = await Order.find({})
        if (orderList) {
            console.log(orderList);
            res.render('orders', { orderList })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const orderPlaced = async (req, res) => {
    try {
        id = req.query.id
        const changeStatus = await Order.findByIdAndUpdate({ _id: id }, { $set: { orderStatus: "Placed" } })
        if (changeStatus) {
            res.redirect('/admin/orders')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const orderShipped = async (req, res) => {
    try {
        id = req.query.id
        const changeStatus = await Order.findByIdAndUpdate({ _id: id }, { $set: { orderStatus: "Shipped" } })
        if (changeStatus) {
            res.redirect('/admin/orders')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const orderDelivered = async (req, res) => {
    try {
        id = req.query.id
        const changeStatus = await Order.findByIdAndUpdate({ _id: id }, { $set: { orderStatus: "Delivered" } })
        if (changeStatus) {
            res.redirect('/admin/orders')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const rejectReturn = async (req, res) => {
    try {
        id = req.query.id
        const changeStatus = await Order.findByIdAndUpdate({ _id: id }, { $set: { orderStatus: "Return rejected" } })
        if (changeStatus) {
            res.redirect('/admin/orders')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const acceptReturn = async (req, res) => {
    try {
        id = req.query.id
        const changeStatus = await Order.findByIdAndUpdate({ _id: id }, { $set: { orderStatus: "Return Accepted" } })
        const orderData = await Order.findOne({ _id: id })
        if (orderData.paymentMethod == 'card') {
            const refund = await User.updateOne({ _id: orderData.userId }, { $inc: { wallet: orderData.totalAmount } })
        }
        const quantity = orderData.items

        for (let i = 0; i < quantity.length; i++) {

            const productstock = await Product.updateOne({ _id: quantity[i].productId }, { $inc: { qty: quantity[i].qty } })

            res.redirect('/admin/orders')

        }

 


    } catch (error) {
        console.log(error.message);
    }
}


const orderView = async (req, res) => {
    try {
        const Id = req.query.orderid
        console.log(Id);
        const orders = await Order.findOne({ orderid: Id }).populate({ path: 'items', populate: { path: 'productId', model: 'Product' } })
        console.log(orders, "asim");
        if (orders) {

            res.render('orderView', { orders })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const returnRequest = async (req, res) => {
    try {
        Id = req.query.id
        const Datee = await Order.findOne({ _id: Id })
        if (Datee) {
            const orderDate = Datee.date
            const orderDateObj = new Date(orderDate);
            const currentDateObj = new Date();
            const timeDiff = currentDateObj.getTime() - orderDateObj.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            if (daysDiff <= 30) {
                const returnOrder = await Order.updateOne({ _id: Id }, { $set: { orderStatus: "return requested" } })

                res.redirect("/orders")
            } else {
                const expiredOrder = await Order.updateOne({ _id: Id }, { $set: { expireStatus: "expired" } })
                res.redirect("/orders")
            }

        }
    } catch (error) {
        console.log(error.message);
    }
}

const cancelRequest = async (req, res) => {
    try{
        const orderId = req.query.id
        const order = await Order.findById(orderId)
        if(order.paymentMethod == "card" && order.orderStatus == 'placed'){
            const refund = await User.findOneAndUpdate({_id:order.userId},{$inc:{wallet:order.totalAmount}})
            order.orderStatus = 'Cancelled'
            order.save()
            res.redirect('/profile')
        }else{
            order.orderStatus = 'Cancelled'
            order.save()
            res.redirect('/profile')
        }

     } catch (error) {
        console.log(error.message);
    }
}


const cancelreturnRequested = async (req, res) => {
    try {
        Id = req.query.id
        const cancelreturnreq = await Order.updateOne({ _id: Id }, { $set: { orderStatus: "Delivered" } })
        if (cancelreturnreq) {

            res.redirect("/orders")
        }
    } catch (error) {
        console.log(error.message);
    }
}


const salesReport = async (req, res) => {
    try {
        const salesData= await Order.find({ orderStatus: 'Delivered'})
        res.render("salesReports",{salesData})
    } catch (error) {
        console.log(error.message);
    }
}

const ViewSalesReport = async (req, res) => {
    try {

        const startDate = new Date(req.body.startdate)
        const endDate = new Date(req.body.enddate)
        endDate.setHours(23, 59, 59, 999); // set the time to the end of the day
        const salesData = await Order.find({
            orderStatus: 'Delivered', date: { $gte: startDate, $lte: endDate }

        })
        console.log(salesData);
        if (salesData) {
            res.render('viewReports', { salesData })
        }


    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadOrder,
    orderPlaced,
    orderShipped,
    acceptReturn,
    rejectReturn,
    orderDelivered,
    orderView,
    returnRequest,
    cancelRequest,
    cancelreturnRequested,
    salesReport,
    ViewSalesReport
}