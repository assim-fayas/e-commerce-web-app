const User = require('../model/userModel');
const Address = require('../model/addressModel');
const Category = require('../model/categoryModel');
const Product = require('../model/productModel');
const Banner = require('../model/bannerModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const config = require("../config/config");
const { findById } = require('../model/addressModel');
const { find } = require('../model/userModel');

const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true
})
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

//for send mail

const sendVerifyMail = async (name, email, user_id) => {
    console.log("create Transport");
    try {

        const transporter = nodemailer.createTransport({

            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }

        });
        const mailOptions = {

            from: config.emailUser,
            to: email,
            subject: 'for verification mail',
            html: '<p> Hai ' + name + ', Please Click Here To <a href="http://localhost:3000/verify?id=' + user_id + '"> To Verify</a> Your Email</p>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been sent:- ", info.response);
            }
        })

    }
    catch (error) {
        console.log("error catch");
        console.log(error.message);
    }
}

// for reset password  and send mail


const sendRestPasswordMail = async (name, email, token) => {
    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }

        });
        const mailOptions = {

            from: config.emailUser,
            to: email,
            subject: 'For Reset Password',
            html: '<p> Hai ' + name + ', Please Click Here To <a href="http://localhost:3000/forget-password?token=' + token + '"> reset</a> Your Password</p>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been sent:- ", info.response);
            }
        })

    }
    catch (error) {
        console.log("error catch");
        console.log(error.message);
    }
}







const loadRegister = async (req, res) => {

    try {
        console.log("inside registration");
        res.render('registration')

    }
    catch (error) {
        console.log(error.message);

    }
}


const insertUser = async (req, res) => {

    try {
        const sPassword = await securePassword(req.body.password);


        const Email = req.body.email;
        checkData = await User.findOne({ Email: Email })

        if (checkData) {
            res.render('registration', { message: 'Email  already exist,Please Try Again' })
        }
        else {

            const user = new User({
                userName: req.body.username,
                Email: req.body.email,
                Password: sPassword,
                Mobile: req.body.mobile,

            })


            const userData = await user.save()

            if (userData) {
                sendVerifyMail(req.body.username, req.body.email, userData._id);
                res.render('registration', { message: "your have registerd successfully,Please verify yor email " });

            }
            else {
                res.render('registration', { message: " registration  faild" });
            }
        }
    }

    catch (error) {
        console.log(error.message);

    }

}


const verifyMail = async (req, res) => {

    try {

        const updateInfo = await User.findOneAndUpdate({ _id: req.query.id }, { $set: { is_Verified: 1 } });

        console.log("updateInfo");
        res.render("email-verified");

    }
    catch (error) {
        console.log(error.message);
    }
}

const loginLoad = async (req, res) => {
    try {
        res.render("login")
        console.log("hello asim");
    }
    catch (error) {
        console.log("error.message");
    }

}

const verifyLogin = async (req, res) => {
    console.log("inside verifyLogin");
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ Email: email })
        if (userData.is_Admin === 1) {
            res.redirect('/admin')
        }

        else if (userData) {

            const passwordMatch = await bcrypt.compare(password, userData.Password);

            if (passwordMatch) {
                console.log(passwordMatch);


                if (userData.is_Verified === 0 || userData.is_Admin === 1 || userData.block === false) {
                    res.render('login', { message: "Invalid Login" })
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/home')
                }
            }
            else {
                res.render('login', { message: "Email and Password Is Incorrect" })
            }

        } else if (password === "" || email === "") {
            res.render('login', { message: " Please Enter Email And Password" })
        } else {
            res.render('login', { message: "Invalid Email or Password" })
        }

    } catch (error) {
        console.log(error.message);

    }

}
const loadHome = async (req, res) => {

    try {
        const category=await Category.find({})
        const product=await Product.find({disable:false}).sort({_id:-1}).limit(4)
        const bannerCategery = await Banner.find({ $and: [{ block: true }, { type: "category" }] })
        // const bannerCategery = await Banner.find({type:category})
        const bannerSliding = await Banner.find({$and:[{type:"sliding"},{block:true}]})
    

        if(category){
            console.log(bannerCategery,"banner");
        res.render('home',{category,product,bannerSliding,bannerCategery});
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

// user logout

const userLogout = async (req, res) => {
    try {
        console.log("logout");
        req.session.user_id = false;
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

//reset password

const forgetLoad = async (req, res) => {
    try {
        res.render('forgot')
    } catch (error) {
        console.log(error.message);
    }
}

// verifying reset password
const forgetVerify = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ Email: email });
        if (userData) {
            console.log(userData);
            if (userData.is_Verified == 0) {
                res.render('forgot', { message: "please Verify Your Mail" })
            }
            else {
                const randomString = randomstring.generate();
                const updatedData = await User.updateOne({ Email: email }, { $set: { token: randomString } })
                sendRestPasswordMail(userData.userName, userData.Email, randomString);
                res.render('forgot', { message: "Please Check Your Email To Reset Your Password" });
            }
        }
        else {
            res.render('forgot', { message: "incorrect e-mail" });
        }
    } catch (error) {
        console.log(error.message);

    }
}


const forgetpasswordload = async (req, res) => {

    try {

        const token = req.query.token;
        const tokenData = await User.findOne({ token: token });
        console.log("forgetpasswordload");
        if (tokenData) {
            res.render("forget-password", { user_id: tokenData._id });

        }
        else {
            res.render('404', { message: " Invalid Token" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async (req, res) => {
    try {
        const password = req.body.Password;
        const user_id = req.body.user_id;
        const secure_password = await securePassword(password);

        const updatedData = await User.findByIdAndUpdate({ _id: user_id }, { $set: { Password: secure_password, token: '' } });
        console.log("password reset");
        res.redirect("/")

    } catch (error) {
        console.log(error.message);
    }
}


const loginOtp = async (req, res) => {
    try {
        res.render('loginMobile')
    } catch (error) {
        console.log(error.message);
    }
}
const verifyNum = async (req, res) => {
    try {
        const num = req.body.mno
        console.log(num);
        const check = await User.findOne({ Mobile: num })
        console.log(check);
        if (check) {
            const otpResponse = await client.verify.
                v2.services(TWILIO_SERVICE_SID)
                .verifications.create({
                    to: num,
                    channel: "sms"
                })
            res.render('loginOtp', { message: num })

        } else {
            res.render('loginMobile', { message: "Did not register in This Mobile Number" })
            console.log("else");

        }
    } catch (error) {
        console.log(error.message);
        console.log("error from login otp load");
    }
}

const verifyNumOtp = async (req, res) => {
    try {
        const num = req.body.mno
        const otp = req.body.otp
        console.log(otp);
        console.log(otp + "" + num);
        const verifiedResponse = await client.verify.
            v2.services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: num,
                code: otp,
            })
        if (verifiedResponse.status == 'approved') {
            const userDetails = await User.findOne({ Mobile: num })
            req.session.user_id = userDetails._id
            console.log(req.session.user_id);
            res.redirect('/home')
            console.log("true otp");
        } else {
            res.render('loginOtp', { message2: 'incorect otp', message: num })
            console.log("false otp");
        }
    } catch (error) {
        console.log(error.message);
        console.log("verify otp section");
    }
}




//user profile

const userprofile = async (req, res) => {
    try {
        let Id = req.session.user_id
        const user = await User.findOne({ _id: Id })
        const address = await Address.find({})
        console.log(address.length);
        res.render("profile", { user, address })
    } catch (error) {
        console.log(error.message);
    }

}




const updateProfile = async (req, res) => {
    try {
        const Id = req.session.user_id
        const name = req.body.name
        const email = req.body.email
        const mobile = req.body.mobile

        const updateUser = await User.findByIdAndUpdate({ _id: Id }, { $set: { userName: name, Email: email, Mobile: mobile } })

        if (updateUser) {

            res.redirect("/profile")
        }

    } catch (error) {
        console.log(error.message);
    }
}


//add address



const viewAddress = async (req, res) => {
    try {
        Id = req.session.user_id
        const addressData = await Address.findOne({ userId: Id })
        console.log("addressesss", addressData);

        res.render('address', { addressData })
    } catch (error) {
        console.log(error.message);
    }
}


const addAddress = async (req, res) => {
    try {


        if (req.session.user_id) {

            Id = req.session.user_id
            console.log(req.body, "request body");


            const AddressObj ={

                fullname: req.body.fullname,
                mobileNumber: req.body.number,
                pincode: req.body.zip,
                houseAddress: req.body.houseAddress,
                streetAddress: req.body.street,
                landMark: req.body.landmark,
                cityName: req.body.city,
                state: req.body.state
            }



            const userAddress = await Address.findOne({ userId: Id })
            if (userAddress) {
                console.log("addred to exist address");
                const userAdrs = await Address.findOne({ userId: Id }).populate('userId').exec()
                // console.log(userAdrs);
                userAdrs.userAddresses.push(AddressObj)
                await userAdrs.save().then((resp) => {
                    res.redirect('/address')
                }).catch((err) => {
                    res.send(err)
                })
                console.log(userAdrs);

            } else {
                console.log("added to new address ");
                let userAddressObj = {
                    userId: Id,
                    userAddresses: [AddressObj]
                }
                await Address.create(userAddressObj).then((resp) => {
                    res.redirect('/address')
                })
            }

        }
    } catch (error) {
        console.log(error.message);
    }
}


const editaddress=async(req,res)=>{
    try {
        console.log("inside edit address");
        const adrsSchemaId = req.params.id
        const adrsId = req.params.adrsId
        const address=mongoose.Types.ObjectId(adrsSchemaId)
        const addresses=mongoose.Types.ObjectId(adrsId)
        console.log(address);
        console.log(addresses);
        const addressData = await Address.findOne({address})
        console.log(addressData);
        const addressIndex = await addressData.userAddresses.findIndex(data=> data.id == addresses)
        
        console.log(addressIndex);
        const editAddress = addressData.userAddresses[addressIndex]
        console.log(editAddress);
        res.render('edit-address',{editAddress,addressIndex})
    } catch (error) {
        console.log(error.message);
    }
}

const updateAddress = async(req,res) =>{
    try{
        // const userAddresses = req.params.id
        console.log("update address");
        const addressIndex = req.params.addressIndex
        console.log(addressIndex);
        const editData = { ...req.body }
        const userId = req.session.user_id
        const updateAdrs = await Address.findOne({userId})
        updateAdrs.userAddresses[addressIndex]= {...editData}
        await updateAdrs.save()
        res.redirect('/address')

    
    }catch(error){
        console.log(error.message);
    }
}


const DeleteAddress = async(req,res)=>{
    try{
        const adrsSchemaId = req.params.id
        const adrsId = req.params.adrsId
        const addressId=mongoose.Types.ObjectId(adrsSchemaId)
        const addresses=mongoose.Types.ObjectId(adrsId)
        console.log(addressId);
        console.log(addresses);
        const addressData = await Address.findOne({addressId})
        console.log(addressData);
        const addressIndex = await addressData.userAddresses.findIndex(data=> data.id == addresses)
        console.log(addressIndex);
        addressData.userAddresses.splice(addressIndex,1)
        await addressData.save()
        res.redirect('/address')
        

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetpasswordload,
    resetPassword,
    verifyNumOtp,
    loginOtp,
    verifyNum,
    userprofile,
    updateProfile,
    addAddress,
    viewAddress,
    editaddress,
    updateAddress,
    DeleteAddress
}