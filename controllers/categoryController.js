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
            description: req.body.description,

        })

        const categoryData = await mainCategory.save()
        console.log(categoryData);
        res.redirect('/admin/Category')

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
        const id = req.body. catId
        console.log(id);
        const deleteData = await Category.findByIdAndDelete({ _id: id })
        console.log(deleteData);
        if (deleteData) {
            res.redirect('/admin/category')
            res.json({success:true})
        }
        else {
            console.log("error in delete catagory");
            res.json({success:true})
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateImage = async (req, res) => {
    try {
        const id = req.query.id
        const Image = req.file.filename
        console.log(id);
        const result = await Category.updateOne({ _id: id }, { $set: { image: Image } });
        res.redirect('/admin/category')
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
}


const addSubcategory = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('addSubcategory', { categories })
    } catch (error) {
        console.log(error.message);
    }
}


// insert the sub categories to main category

const insertsubCategory = async (req, res) => {
    try {
        const parentCategory = req.body.parentCategory;


        const subcategoryData = {
            name: req.body.name,
            mainCategory: parentCategory
        }

        const category = await Category.findOne({ name: parentCategory })
        // console.log(subcategoryData);
        //  console.log(category);

        category.subCategories.push(subcategoryData); // add subcategoryData object to subCategories array

        const insertData = await category.save(); // save the updated category object

        // console.log(insertData);
        if (insertData) {
            res.redirect('/admin/category')
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
    deleteCategory,
    addSubcategory,
    insertsubCategory,
    updateImage
}