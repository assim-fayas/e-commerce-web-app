const Brand = require('../model/brandModel');
const User = require('../model/userModel');





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
          
        }

    } catch (error) {
        console.log(error.message);
    }
}
const disableBrand = async (req, res) => {
    try {
        const Id = req.body.brandId
        // console.log(Id, "this is i ");
        console.log(Id, 'iAM herer');
        const Disable = await Brand.findOne({ _id: Id }, { disable: 1, _id: Id })
        console.log(Disable);
        if (Disable.disable === true) {
            const disable = await Brand.findByIdAndUpdate({ _id: Id }, { $set: { disable: false } })
            res.redirect('/admin/brand')
            res.json({success:true})
        }
        else {
            const enable = await Brand.findByIdAndUpdate({ _id: Id }, { $set: { disable: true } })

            res.redirect('/admin/brand')
            res.json({success:true})
        }
    } catch (error) {
        console.log(error.message);
    }
}

const editBrand = async (req, res) => {
    try {
        Id = req.query.id
        const brand = await Brand.findOne({ _id: Id })
        res.render('editBrand', { brand })
    } catch (error) {
        console.error(error.message);
    }
}
const updateBrand = async (req, res) => {
    try {
       const Id = req.query.id
       console.log(Id,"braaaand");
       console.log(req.body.name);
       const update = await Brand.findByIdAndUpdate({ _id: Id }, { $set: { name:req.body.name} })
        console.log(update);
        res.redirect('/admin/brand')
    } catch (error) {
        console.log(error.message);
    }
}
const updateImage=async(req,res)=>{
    try {
        const id = req.query.id
        console.log(id,"BRAND Image id");

        const Image = req.file.filename
  
        const result = await Brand.updateOne({ _id: id }, { $set: { image: Image } });
        console.log(result);
        res.redirect('/admin/brand')
     
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    addBrand,
    insertBrand,
    loadBrand,
    disableBrand,
    editBrand,
    updateBrand,
    updateImage
}