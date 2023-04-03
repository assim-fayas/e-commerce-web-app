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
    try {
        Id = req.query.id
        console.log(Id, "cancell req id ");
        const Datee = await Order.findOne({ _id: Id })
        if (Datee) {
            const orderDate = Datee.date
            const orderDateObj = new Date(orderDate);
            const currentDateObj = new Date();
            const timeDiff = currentDateObj.getTime() - orderDateObj.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            if (daysDiff <= 30) {
                const cancelOrder = await Order.updateOne({ _id: Id }, { $set: { orderStatus: "Cancelled" } })


                if (cancelOrder) {
                    res.redirect("/orders")
                }




            }


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
    cancelreturnRequested
}