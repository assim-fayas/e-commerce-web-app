const Order = require('../model/orderModel')


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
        if (changeStatus) {
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



module.exports = {
    loadOrder,
    orderPlaced,
    orderShipped,
    acceptReturn,
    rejectReturn,
    orderDelivered,
    orderView
}