const Products = require("../model/productModel");
const Category = require("../model/categoryModel");
const Brand = require("../model/brandModel");
const User = require("../model/userModel");
const Address = require("../model/addressModel");
const Coupon = require("../model/coupenModel");
const Order = require("../model/orderModel");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { findOneAndUpdate } = require("../model/productModel");
const { v4: uuidv4 } = require("uuid");

//product management
const loadProduct = async (req, res) => {
  try {
    const products = await Products.find({});

    res.render("product", { products });
  } catch (error) {
    console.log(error.message);
  }
};

const addProduct = async (req, res) => {
  try {
    const category = await Category.find({});
    const brand = await Brand.find({});
    res.render("addProduct", { category, brand });
  } catch (error) {
    console.log(error.message);
  }
};

const insertProduct = async (req, res) => {
  try {
    const Images = [];
    for (file of req.files) {
      Images.push(file.filename);
    }
    const productData = new Products({
      image: Images,
      productName: req.body.name,
      brand: req.body.Brand,
      subCategory: req.body.subCategory,
      mainCategory: req.body.MainCategory,
      size: req.body.size,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
    });
    const Product = await productData.save();
    if (Product) {
      res.redirect("/admin/products");
      // console.log(productData);
    }
  } catch (error) {
    console.log(error.message);
  }
};
const viewProduct = async (req, res) => {
  try {
    const category = req.query.categoryId;
    const search = req.query.search || "";
    const sort = req.query.sort || "";
    console.log(category + " - " + search + " - " + sort);
    let isRender = false;

    if (req.query.isRender) {
      isRender = true;
    }

    const searchData = new String(search).trim();
    console.log(searchData);

    const query = {
      is_delete: false,
    };

    let sortQuery = { price: 1 };
    if (sort == "high-to-low") {
      sortQuery = { price: -1 };
    }

    if (search) {
      query["$or"] = [
        { productName: { $regex: ".*" + searchData + ".*", $options: "i" } },
        { description: { $regex: searchData, $options: "i" } },
      ];
    }

    if (category) {
      query["$or"] = [{ mainCategory: category }];
    }

    const product = await Products.find(query).sort(sortQuery);

    //console.log(product);

    const productsPerPage = 5;
    const page = req.query.page || 1;
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = product.slice(startIndex, endIndex);
    const totalPages = Math.ceil(product.length / productsPerPage);

    // -----------Category finding
    const categoryData = await Category.find({});

    // ----------------------

    if (isRender == true) {
      res.json({
        pageProducts,
        totalPages,
        currentPage: parseInt(page, 10),
        product,
        // cartCount,
        // wishListCount
      });
    } else {
      res.render("products", {
        pageProducts,
        totalPages,
        currentPage: parseInt(page, 10),
        product,
        categoryData,
      });
    }
  } catch (error) {
    console.log(error.message);
    console.log("------------------Product Page Section-----------");
  }
};

const singleProduct = async (req, res) => {
  try {
    const productId = req.query.id;
    const productData = await Products.findById({ _id: productId });
    const categoryData = await Products.find({ mainCategory: productData.mainCategory }).limit(4)


    res.render("singleProduct", { productData, categoryData });
  } catch (error) {
    console.log(error.message);
  }
};

const editProduct = async (req, res) => {
  try {
    Id = req.query.id;
    const category = await Category.find({});
    const brand = await Brand.find({});
    const product = await Products.findById({ _id: Id });
    res.render("editProduct", { category, brand, product });
  } catch (error) {
    console.log(error.message);
  }
};

//  update product
const updateProduct = async (req, res) => {
  const id = req.query.id;
  console.log(req.query.id);
  console.log(req.body);
  const updateProduct = await Products.findByIdAndUpdate(id, {
    $set: {
      productName: req.body.name,
      brand: req.body.Brand,
      subCategory: req.body.subCategory,
      mainCategory: req.body.MainCategory,
      size: req.body.size,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
    },
  });
  if (updateProduct) {
    res.redirect("/admin/products");
  }
};

//disable and enabling product
const disable = async (req, res) => {
  try {
    const Id = req.body.prId;
    const Disable = await Products.findOne(
      { _id: Id },
      { disable: 1, _id: Id }
    );
    console.log(Disable);
    if (Disable.disable === true) {
      const disable = await Products.findByIdAndUpdate(
        { _id: Id },
        { $set: { disable: false } }
      );
      res.redirect("/admin/products");
      res.json({success:true})
    } else {
      const enable = await Products.findByIdAndUpdate(
        { _id: Id },
        { $set: { disable: true } }
      );

      res.redirect("/admin/products");
      res.json({success:true})
    }
  } catch (error) {
    console.log(error.message);
  }
};

//wishlist

const loadWishlist = async (req, res) => {
  try {
    const Id = await req.session.user_id;
    const userData = await User.findOne({ _id: Id })
      .populate("whishlist.product")
      .exec();
    // console.log(userData);
    res.render("wishlist", { userData });
  } catch (error) {
    console.log(error.message);
  }
};

const AddToWishlist  =async(req,res) => { 
  try{
      const productId = req.body.productId
      // console.log(req.session.user_id);
      let exist =await User.findOne({id:req.session.user_id,'whishlist.product':productId})
      // console.log(exist);
      if(exist){
          res.json({status:false})
      }else{
          const product =await Products.findOne({_id:req.body.productId})
          const _id = req.session.user_id
          const userData = await User.findOne({_id})
          const result = await User.updateOne({_id},{$push:{whishlist:{product:product._id}}})
          if(result){
              res.json({status:true})
          }else{
              console.log('not addeed to wishlist');
          }
      }

  }catch(error){
      console.log(error.message);
  }
}
const wishlistToCart = async(req,res)=>{
  try{
    console.log("inside wishlist to cart");
      const productId = req.body.productId
      console.log("produt Id",productId);
      const _id = req.session.user_id
      console.log("user  Id",_id);
      const userId = mongoose.Types.ObjectId(_id)
      console.log(userId);
      let exist =await User.findOne({_id:req.session.user_id,'cart.productId':productId})
      if(exist){
          // const user = await User.findOne({_id:req.session.user_id})
          // const index =await user.cart.findIndex(data=>data.productId._id == req.body.productId );
          //     user.cart[index].qty +=1;
          //     user.cart[index].productTotalPrice= user.cart[index].qty * user.cart[index].price
          //     await user.save();
          //     const remove = await User.updateOne({_id},{$pull:{whishlist:{product:productId}}})
          console.log("exixst");
            res.send(false)
      }else{
        console.log("ELSE");
          const product =await Products.findOne({_id:req.body.productId})
          console.log(product,"p");
          const userData = await User.findOne({_id})
          console.log(userData,"u");
          const result = await User.findOneAndUpdate({_id:_id},{$push:{cart:{productId:product._id,qty:1,price:product.price,productTotalPrice:product.price}}})
          console.log(result,"result");
          if(result){
              const remove = await User.findOneAndUpdate({_id:userId},{$pull:{whishlist:{product:productId}}})
              console.log(remove,"r");
              res.send(true)
          }else{
              console.log('not addeed to cart');
          }
      }

  }catch(error){
      console.log(error.message);
  }
}
const deleteWishlistProduct = async(req,res) => { 
  try{
      const id = req.session.user_id
      const deleteProId=req.body.productId
      const deleteWishlist = await User.findByIdAndUpdate({_id:id},{$pull:{whishlist:{product:deleteProId}}})
      if(deleteWishlist){
          res.json({success:true})
      }
  }catch(error){
      console.log(error.message);
  }
}

//cart

const loadCart = async (req, res) => {
  try {
    Id = req.session.user_id;
    const temp = mongoose.Types.ObjectId(req.session.user_id);
    const usercart = await User.aggregate([
      { $match: { _id: temp } },
      { $unwind: "$cart" },
      { $group: { _id: null, totalcart: { $sum: "$cart.productTotalPrice" } } },
    ]);
    if (usercart.length > 0) {
      const cartTotal = usercart[0].totalcart;
      // console.log(cartTotal);
      const cartTotalUpdate = await User.updateOne(
        { _id: Id },
        { $set: { cartTotalPrice: cartTotal } }
      );
      const userData = await User.findOne({ _id: Id })
        .populate("cart.productId")
        .exec();
      res.render("cart", { userData });
      // console.log("product dattaaaaaaaaa");
    } else {
     
      const userData = await User.findOne({ Id });
      res.render("cart", { userData });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const addtoCart = async (req, res) => {
  try {
    // console.log("inside add to cart");
    const proId = req.body.productId;
    // console.log(proId);
    const userid = req.session.user_id;
    // console.log(userid);

    let existed = await User.findOne({ id: userid, "cart.productId": proId });
    console.log(existed, "existed product id");

    if (existed) {
      res.json({ status: false });
    } else {
      const product = await Products.findOne({ _id:proId });
      console.log(product, "pro");
      const userId = req.session.user_id;
      const user = await User.findOne({ _id: userId });
      const productAdd = await User.updateOne(
        { _id: user },
        {
          $push: {
            cart: {
              productId: product._id,
              qty: 1,
              name: product.productName,
              price: product.price,
              productTotalPrice: product.price,
            },
          },
        }
      );
      console.log(productAdd, "add");

      if (productAdd) {
        res.json({ status: true });
        console.log("added success fully");
      } else {
        console.log("not added to cart ");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const deleteCart = async (req, res) => {
  try {
    console.log("delete cart");
    const Id = req.body.productId;
    console.log(Id);
    const userId = req.session.user_id;
    const deleteCart = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { cart: { productId: Id } } }
    );

    if (deleteCart) {
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const change_Quantities = async (req, res) => {
  try {
    console.log("inside cjange quantity");
    const { user, product, count, Quantity, proPrice } = req.body;
    const producttemp = mongoose.Types.ObjectId(product);
    const usertemp = mongoose.Types.ObjectId(user);
    const updateQTY = await User.findOneAndUpdate(
      { _id: usertemp, "cart.productId": producttemp },
      { $inc: { "cart.$.qty": count } }
    );

    const currentqty = await User.findOne(
      { _id: usertemp, "cart.productId": producttemp },
      { _id: 0, "cart.qty.$": 1 }
    );

    const qty = currentqty.cart[0].qty;
    console.log(qty);

    const productSinglePrice = proPrice * qty;

    await User.updateOne(
      { _id: usertemp, "cart.productId": producttemp },
      { $set: { "cart.$.productTotalPrice": productSinglePrice } }
    );
    const cart = await User.findOne({ _id: usertemp });
    let sum = 0;
    for (let i = 0; i < cart.cart.length; i++) {
      sum = sum + cart.cart[i].productTotalPrice;
      console.log(sum);
    }

    const update = await User.updateOne(
      { _id: usertemp },
      { $set: { cartTotalPrice: sum } }
    ).then(async (response) => {
      res.json({ response: true, productSinglePrice, sum });
    });
  } catch (error) {
    console.log(error.message);
  }
};

//checkout

const loadCheckout = async (req, res) => {
  try {
    Id = req.session.user_id;
    const addressData = await Address.findOne({ userAddress: Id });
    const userData = await User.findOne({ _id: Id })
      .populate("cart.productId")
      .exec();

    res.render("checkout", { addressData, userData });
  } catch (error) {
    console.log(error.message);
  }
};

const checkoutaddAddress = async (req, res) => {
  try {
    console.log("inside checkout address");
    if (req.session.user_id) {
      Id = req.session.user_id;
      console.log(Id, "idd");

      const AddressObj = {
        fullname: req.body.fullname,
        mobileNumber: req.body.number,
        pincode: req.body.zip,
        houseAddress: req.body.houseAddress,
        streetAddress: req.body.street,
        landMark: req.body.landmark,
        cityName: req.body.city,
        state: req.body.state,
      };

      const userAddress = await Address.findOne({ userId: Id });
      if (userAddress) {
        console.log("addred to exist address");
        const userAdrs = await Address.findOne({ userId: Id })
          .populate("userId")
          .exec();
        // console.log(userAdrs);
        userAdrs.userAddresses.push(AddressObj);
        await userAdrs
          .save()
          .then((resp) => {
            res.redirect("/checkout");
          })
          .catch((err) => {
            res.send(err);
          });
        console.log(userAdrs);
      } else {
        console.log("added to new address ");
        let userAddressObj = {
          userId: Id,
          userAddresses: [AddressObj],
        };
        await Address.create(userAddressObj).then((resp) => {
          res.redirect("/checkout");
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const placeOrder = async (req, res) => {
  try {
    console.log("get place order");
    const userId = req.session.user_id;

    const index = req.body.address;

    const discount = req.body.couponDiscount;
    const totel = req.body.total1;
    const coupon = req.body.couponC;

    const couponUpdate = await Coupon.updateOne(
      { Coupencode: coupon },
      { $push: { used: userId } },
      { $inc: { limit: -1 } }
    );
    console.log(couponUpdate);

    console.log(index);

    const address = await Address.findOne({ userId: userId });

    const userAddress = address.userAddresses[index];

    const cartData = await User.findOne({ _id: userId }).populate(
      "cart.productId"
    );
    const total = cartData.cartTotalPrice;
    const payment = req.body.payment;
    let status = req.body.payment === "COD" ? "placed" : "pending";
    // console.log(payment, "payment");

    const randomstring = uuidv4().slice(0, 5);
    console.log(randomstring, "random string");

    let orderObj = {
      userId: userId,
      address: {
        fullName: userAddress.fullname,
        mobileNumber: userAddress.mobileNumber,
        pincode: userAddress.pincode,
        houseAddress: userAddress.houseAddress,
        streetAddress: userAddress.streetAddress,
        landMark: userAddress.landMark,
        cityName: userAddress.cityName,
        state: userAddress.state,
      },
      paymentMethod: payment,
      orderStatus: status,
      items: cartData.cart,
      totalAmount: total,
      discount: discount,
      orderid: randomstring,
    };
    await Order.create(orderObj).then(async (data) => {
      const orderId = data._id.toString();

      // const orderedId=await Order.find({_id:},{$set:{orderid:orderId}})

      if (payment == "COD") {
        const userData = await User.findOne({ _id: userId });

        const cartData = userData.cart;

        for (let i = 0; i < cartData.length; i++) {
          const productStock = await Products.findById(cartData[i].productId);
          productStock.quantity -= cartData[i].qty;
          await productStock.save();
        }
        await User.updateOne(
          { _id: userId },
          { $set: { cart: [], cartTotalPrice: 0 } }
        );
        res.json({ status: true });
      } else if (payment == "wallet") {
        const userData = await User.findOne({ _id: userId });
        if (userData.wallet >= total) {
          const cartData = userData.cart;
          for (let i = 0; i < cartData.length; i++) {
            const productStock = await Products.findById(cartData[i].productId);
            productStock.quantity -= cartData[i].qty;
            await productStock.save();
          }
          const walletBalence = userData.wallet - userData.cartTotalPrice;

          await User.updateOne(
            { _id: userId },
            { $set: { cart: [], cartTotalPrice: 0, wallet: walletBalence } }
          );

          await Order.updateOne(
            { _id: orderId },
            { $set: { paymentMethod: "Wallet", orderStatus: "placed" } }
          );
          const wallet = User.wallet;

          res.json({ status: true });
        } else {
          res.json({ walletBalance: true });
        }
      } else {
        var instance = new Razorpay({
          key_id: process.env.KEY_ID,
          key_secret: process.env.KEY_SECRET,
        });
        let amount = total;
        instance.orders.create(
          {
            amount: amount * 100,
            currency: "INR",
            receipt: orderId,
          },
          (err, order) => {
            console.log(order, "orderaaaa");
            res.json({ status: false, order });
          }
        );
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const verifyPayment = async (req, res) => {
  try {
    console.log("inside verifypayment ");
    console.log(req.body);
    const userId = req.session.user_id;
    const details = req.body;
    console.log(details.payment);
    let hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
    hmac.update(
      details.payment.razorpay_order_id +
      "|" +
      details.payment.razorpay_payment_id
    );
    hmac = hmac.digest("hex");

    const orderId = details.order.receipt;
    console.log(orderId);
    if (hmac == details.payment.razorpay_signature) {
      console.log("order Successfull");
      await User.updateOne(
        { _id: userId },
        { $set: { cart: [], cartTotalPrice: 0 } }
      );
      await Order.findByIdAndUpdate(orderId, {
        $set: { orderStatus: "placed" },
      })
        .then((data) => {
          res.json({ status: true, data });
        })
        .catch((err) => {
          console.log(err);
          res.data({ status: false, err });
        });
    } else {
      res.json({ status: false });
      console.log("payment failed");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const orderSuccess = async (req, res) => {
  try {
    console.log("inside order conformation");
    const userId = req.session.user_id;
    console.log(userId);
    const userData = await User.findOne({ _id: userId });

    const orderData = await Order.findOne({ userId: userId })
      .populate({
        path: "items",
        populate: { path: "productId", model: "Product" },
      })
      .sort({ createdAt: -1 })
      .limit(1);
    res.render("oo", { orderData });
  } catch (error) {
    console.log(error.message);
  }
};

const OrderHistory = async (req, res) => {
  try {
    Id = req.session.user_id;
    console.log(Id);
    const orderedData = await Order.find({ userId: Id });
    if (orderedData) {
      res.render("orderHistory", { orderedData });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const shopCategory = async (req, res) => {
  try {

    const categery = req.query.categoryId;
    const search = req.query.search || "";
    const sort = req.query.sort || "";
    console.log(categery + " - " + search + " - " + sort);
    let isRender = false;


    if (req.query.isRender) {
      isRender = true;
    };
    const searchData = new String(search).trim();
    console.log(searchData);

    const query = {
      is_delete: false,
    };

    let sortQuery = { price: 1 };
    if (sort == "high-to-low") {
      sortQuery = { price: -1 };
    }


    if (search) {
      query["$or"] = [
        { productName: { $regex: ".*" + searchData + ".*", $options: "i" } },
        { description: { $regex: searchData, $options: "i" } },
      ];
    }



    if (categery) {
      query["$or"] = [{ mainCategory: category }];
    }

    const product = await Products.find(query).sort(sortQuery);


    const productsPerPage = 5;
    const page = req.query.page || 1;
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = product.slice(startIndex, endIndex);
    const totalPages = Math.ceil(product.length / productsPerPage);
    const categooryData = await Category.find({});

    Id = req.query.Id
    const category = await Category.findById({ _id: Id })
    const categoryName = category.name
    const categeryProduct = await Products.find({ mainCategory: categoryName })
    const categeryProductdrop = await Products.find({ mainCategory: categoryName }).limit(1)

    const categoryData = await Category.find({ name: { $ne: categoryName } })
    // res.render('shopCategory',{categeryProduct,categoryData})

    if (isRender == true) {
      res.json({
        pageProducts,
        totalPages,
        currentPage: parseInt(page, 10),
        product,
        categeryProduct,
        categoryData,
        categeryProductdrop
        // cartCount,
        // wishListCount
      });
    } else {
      res.render("shopCategory", {
        pageProducts,
        totalPages,
        currentPage: parseInt(page, 10),
        product,
        categooryData,
        categeryProduct,
        categoryData,
        categeryProductdrop
      });
    }


  } catch (error) {
    console.log(error.message);
  }
}
module.exports = {
  loadProduct,
  addProduct,
  insertProduct,
  viewProduct,
  singleProduct,
  editProduct,
  updateProduct,
  disable,
  loadWishlist,
  AddToWishlist,
  deleteWishlistProduct,
  wishlistToCart,
  loadCart,
  addtoCart,
  deleteCart,
  change_Quantities,
  loadCheckout,
  checkoutaddAddress,
  placeOrder,
  orderSuccess,
  verifyPayment,
  OrderHistory,
  shopCategory,

};
