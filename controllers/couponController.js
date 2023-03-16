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
            Coupencode: req.body.coupenCode,
            coupenAmountType: req.body.discType,
            coupenAmount: req.body.discAmount,
            minCartAmount: req.body.minAmount,
            minRedeemAmount: req.body.minRedeemAmount,
            startDate: req.body.startdate,
            expiryDate: req.body.expdate,
            limit: req.body.limit

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

const editCoupen = async (req, res) => {
    try {
        const id = req.query.id
        const coupen = await Coupon.findById({ _id: id })
        console.log(coupen);

        res.render('editCoupen', { coupen })
    } catch (error) {
        console.log(error.message);
    }
}

const updateCoupen = async (req, res) => {
    try {
        Id = req.query.id
        const updateData = await Coupon.findByIdAndUpdate(Id, {
            $set: {
                Coupencode: req.body.coupenCode,
                coupenAmountType: req.body.discType,
                coupenAmount: req.body.discAmount,
                minCartAmount: req.body.minAmount,
                minRedeemAmount: req.body.minRedeemAmount,
                startDate: req.body.startdate,
                expiryDate: req.body.expdate,
                limit: req.body.limit

            }
        })
        if (updateData) {
            res.redirect('/admin/coupen')
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadCoupen,
    addCoupen,
    insertCoupen,
    editCoupen,
    updateCoupen
}