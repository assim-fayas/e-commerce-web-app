const Category = require('../model/categoryModel');


//Catagory management

const loadCatagory = async (req, res) => {
    try {
        const category = await Category.find({})
        res.render('catagory', { category });
    } catch (error) {
        console.log(error.message);
    }

}

const loadAddcategory = async (req, res) => {
    try {

        res.render('addCategory')
    } catch (error) {
        console.log(error.message);
    }

}

const insertMaincategory = async (req, res) => {
    try {

        const mainCategory = new Category({
            image: req.file.filename,
            name: req.body.name,
            description: req.body.description
        })

        const categoryData = await mainCategory.save()
        console.log(categoryData);
        res.redirect('/admin/addCategory')

    } catch (error) {
        console.log(error.message);
    }
}

const viewCategory = async (req, res) => {
    try {
        const category = await Category.find({})

        res.render('category', { category });



    } catch (error) {
        console.log(error.message);
    }
}

const editCategory = async (req, res) => {
    try {
        const id = req.query.id;
        const category = await Category.find({ _id: id }, {})
        res.redirect('/admin/editCategory')
    } catch (error) {
        console.log(error.message);
    }
}





module.exports = {
    loadCatagory,
    loadAddcategory,
    insertMaincategory,
    viewCategory,
    editCategory
}