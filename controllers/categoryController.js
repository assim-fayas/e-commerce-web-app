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
        const category = await Category.findOne({ _id: id })
        res.render('editCategory', { category })
    } catch (error) {
        console.log(error.message);
    }
}

const updateCategory = async (req, res) => {
    try {

        const id = req.query.id;

        // console.log("category id", id);
        // console.log(req.body);
        const categoryData = await Category.findByIdAndUpdate(id, { $set: { name: req.body.name, description: req.body.description } })
        console.log(categoryData);
        if (categoryData) {
            res.redirect('/admin/category')
        }
        else {
            console.log("kitteelllaaa")
        }
    }
    catch (error) {
        console.log(error.message);
    }
}


const deleteCategory = async (req, res) => {

    try {
        const id = req.query.id
        console.log(id);
        const deleteData = await Category.findByIdAndDelete({ _id: id })
        console.log(deleteData);
        if (deleteData) {
            res.redirect('/admin/category')
        }
        else {
            console.log("error in delete catagory");
        }
    } catch (error) {
        console.log(error.message);
    }

}


module.exports = {
    loadCatagory,
    loadAddcategory,
    insertMaincategory,
    viewCategory,
    editCategory,
    updateCategory,
    deleteCategory
}