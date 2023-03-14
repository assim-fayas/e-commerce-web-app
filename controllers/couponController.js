const Coupon = require('../model/coupenModel')




const loadCoupen = async (req, res) => {
    try {
        const coupon = await Coupon.find({})
        console.log(coupon);
        res.render('coupen', { coupon })
    } catch (error) {
        console.log(error.message);
    }
}

const addCoupen = async (req, res) => {
    try {
        res.render('addCoupen')
    } catch (error) {
        console.log(error.message);
    }
}

const insertCoupen = async (req, res) => {
    try {
        const coupen = new Coupon({
            code: req.body.coupenCode,
            discount_Type: req.body.discType,
            discountAmount: req.body.discAmount,
            maxDiscountamount: req.body.maxDiscount,
            mainPurchase: req.body.minPurchase,
            expiryDate: req.body.date

        })

        const coupenData = await coupen.save()
        if (coupenData) {
            res.redirect('/admin/coupen')
        }
    }
    catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadCoupen,
    addCoupen,
    insertCoupen
}