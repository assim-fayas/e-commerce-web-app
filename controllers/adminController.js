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
            console.log(userData);
            const passwordMatch = await bcrypt.compare(password, userData.Password);
            if (passwordMatch) {
                console.log(passwordMatch);
                if (userData.is_Admin === 0) {
                    res.render('adminLogin', { message: "Email and password is incorrect" })
                }
                else {
                    req.session.admin_id = userData._id;
                    res.redirect("/admin/home")
                }


            } else {
                res.render('adminLogin', { message: "Email and password ids incorrect" })
            }
        }
        else {
            res.render('adminLogin', { message: "Email and password ids incorrect" })
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

// admin logout

const logout = async (req, res) => {
    try {
        req.session.admin_id = false;
        res.redirect('/admin')
    } catch (error) {
        console.log(error.messag);
    }
}



//users  management 

const loadusers = async (req, res) => {
    try {
        const users = await User.find({ is_Admin: 0 })

        res.render('users', { users });



    } catch (error) {
        console.log(error.message);
    }
}

const blockUser = async (req, res) => {
    try {
        // console.log(req.query.id)
        const id = req.query.id
        const users = await User.findOne({ _id: id }, { block: 1, _id: id })

        if (users.block === false) {
            const blockuser = await User.updateOne({ _id: id }, { $set: { block: true } })
            req.session.user_id = true
            res.redirect('/admin/users')
        }
        else {
            const blockuser = await User.updateOne({ _id: id }, { $set: { block: false } })
            req.session.user_id = false
            res.redirect('/admin/users')
        }

    } catch (error) {
        console.log(error.message);
    }
}




//product management


const loadProduct = async (req, res) => {
    try {
        res.render('product')
    } catch (error) {
        console.log(error.message);
    }
}







//order management


const loadOrder = async (req, res) => {
    try {
        res.render('order')
    } catch (error) {
        console.log(error.message);
    }
}



//Coupen management

const loadCoupen = async (req, res) => {
    try {
        res.render('coupen')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadadminLogin,
    verifyLogin,
    loadDashboard,
    logout,
    loadusers,
    loadProduct,
    loadOrder,
    loadCoupen,
    blockUser
}