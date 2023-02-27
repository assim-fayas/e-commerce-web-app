const User = require('../model/userModel');
const bcrypt = require('bcrypt');

const nodemailer = require("nodemailer");


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
                user: 'asim1fayas@gmail.com',
                pass: 'gzfpikpylkbrggzu'
            }

        });
        const mailOptions = {

            from: 'asim1fayas@gmail',
            to: email,
            subject: 'for verification mail',
            html: '<p> Hai ' +name+ ', Please Click Here To <a href="http://localhost:3000/verify?id=' + user_id + '"> To Verify</a> Your Email</p>'
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
        console.log("data saved");
        const user = new User({
            userName: req.body.username,
            Email: req.body.email,
            Password: sPassword

        })

        const userData = await user.save()
        if (userData) {
            sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('registration', { message: "your registration has been successfully " });

        }
        else {
            res.render('registration', { message: "your registration has been faild" });
        }

    }

    catch (error) {
        console.log(error.message);

    }

}


const verifyMail = async (req, res) => {

    try {

        const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_Verified: 1 } });

        console.log("updateInfo");
        res.render("email-verified");

    }
    catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    verifyMail
}