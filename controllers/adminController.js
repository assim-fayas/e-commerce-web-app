const User = require('../model/userModel');
const bcrypt = require('bcrypt');


const loadadminLogin = async (req, res) => {
    try {

        res.render('adminLogin');

    }

    catch (error) {
        console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;


        const userData = await User.findOne({ Email: email });

        if (userData) {

            const passwordMatch = await bcrypt.compare(password, userData.Password);
            if (passwordMatch) {
                if (userData.is_Admin === 0) {
                    res.render('login', { message: "Email and password is incorrect" })
                }
                else {
                    req.session.user_id = userData._id;
                    res.redirect("/admin/home")
                }


            } else {
                res.render('login', { message: "Email and password ids incorrect" })
            }
        }
        else {
            res.render('login', { message: "Email and password ids incorrect" })
        }

    } catch (error) {
        console.log(error.message);
    }

}




const loadDashboard = async (req, res) => {
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message);

    }
}



const logout = async (req, res) => {
    try {
        req.session.user_id = null;
        res.redirect('/')
    } catch (error) {
        console.log(error.messag);
    }
}

module.exports = {
    loadadminLogin,
    verifyLogin,
    loadDashboard,
    logout
}