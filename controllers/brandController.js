const Brand = require('../model/brandModel')




const loadBrand = async (req, res) => {
    try {
        const brand = await Brand.find({})
        res.render('brand', { brand })
    } catch (error) {
        console.log(error.message);
    }
}



const addBrand = async (req, res) => {
    try {

        res.render('addBrand')
    } catch (error) {
        console.log(error.message);
    }
}

const insertBrand = async (req, res) => {
    try {
        const Image = req.file.filename
        const brand = req.body.name

        const brandData = new Brand({
            image: Image,
            name: brand
        })

        if (brandData) {
            const brand = await brandData.save()
            res.redirect('/admin/brand')
            console.log(brand);
        }

    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    addBrand,
    insertBrand,
    loadBrand
}