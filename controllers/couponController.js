const Coupon = require('../model/coupenModel')
const User = require('../model/userModel')





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

const disableCoupen = async (req, res) => {
  try {
    const Id = req.body.coupenId
    const Disable = await Coupon.findOne({ _id: Id }, { disable: 1, _id: Id })
    console.log(Disable);
    if (Disable.disable === true) {
      const disable = await Coupon.findByIdAndUpdate({ _id: Id }, { $set: { disable: false } })
      res.redirect('/admin/coupen')
      res.json({success:true})
    }
    else {
      const enable = await Coupon.findByIdAndUpdate({ _id: Id }, { $set: { disable: true } })

      res.redirect('/admin/coupen')
      res.json({success:true})
    }
  } catch (error) {
    console.error(error.message);
  }
}
const couponApply = async (req, res) => {
  try {

    const userId = req.session.user_id
    const user = await User.findOne({ _id:userId });
    let cartTotal = user.cartTotalPrice;
    console.log(cartTotal);

    // const exist = await Coupon.findOne(
    //   { couponCode: req.body.code, used: userId },
    //   { used: { $elemMatch: { $eq: userId } } }
    // );
    const exist = await Coupon.findOne(
      { Coupencode: req.body.code, used: userId },
      { used: { $elemMatch: { $eq: userId } } }
    );

    if (exist) {

      return res.json({ used: true });
    } else {
      const couponData = await Coupon.findOne({ Coupencode:req.body.code });
      if (couponData) {
        if (couponData.expiryDate >= new Date()) {
          if (couponData.limit !== 0) {
            if (couponData. minCartAmount <= cartTotal) {
              if (couponData.coupenAmountType === "flat") {
                let discountValue = couponData.coupenAmountType;
                let value = Math.round(cartTotal - couponData.coupenAmountType);
                return res.json({
                  amountokey: true,
                  value,
                  discountValue,
                  code: req.body.code,
                });
              } else if (couponData.coupenAmountType === "percentage") {
                const discountPercentage =
                  (cartTotal*couponData.coupenAmount) / 100; 
                if (discountPercentage <= couponData.minRedeemAmount) {  
                  let discountValue = discountPercentage;
                  let value = Math.round(cartTotal - discountPercentage);
                  return res.json({
                    amountokey: true,
                    value,
                    discountValue,
                    code: req.body.code,
                  });
                } else {
                  let discountValue = couponData.minRedeemAmount;
                  let value = Math.round(cartTotal - couponData.minRedeemAmount);
                  return res.json({
                    amountokey: true,
                    value,
                    discountValue,
                    code: req.body.code,
                  });
                }
              }
            } else {
              console.log(`must purchase above ${couponData.minCartAmount}`);
              res.json({ minimum: true });
            }
          } else {
            res.json({ limit: true });
          }
        } else {
          res.json({ datefailed: true });
        }
      } else {
        res.json({ invalid: true });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};


module.exports = {
  loadCoupen,
  addCoupen,
  insertCoupen,
  editCoupen,
  updateCoupen,
  disableCoupen,
  couponApply
}