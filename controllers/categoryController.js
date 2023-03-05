const category = require('../model/categoryModel');

//Catagory management

const loadCatagory = async (req, res) => {
    try {
        res.render('catagory')
    } catch (error) {
        console.log(error.message);
    }

}






module.exports = {
    loadCatagory
}