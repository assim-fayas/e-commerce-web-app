const mongoose = require("mongoose");

const Banner = require('../model/bannerModel')




const loadbanner = async (req, res) => {
    try {
        const bannerData = await Banner.find({})


        if (bannerData)

            res.render('banner', { bannerData })

    } catch (error) {
        console.log(error.message);
    }

}

const loadBannerCaro = async (req, res) => {
    try {
        res.render('addBannercaro')
    } catch (error) {
        console.log(error.message);
    }
}


const insertBannerCaro = async (req, res) => {
    try {

        const Images = []
        for (file of req.files) {
            Images.push(file.filename)
        }
        const banner = new Banner({
            image: Images,
            type: req.body.bannertype,
            description: req.body.description
        })

        if (banner) {
            const Banner = await banner.save()
            res.redirect('/admin/banner')
        }
    } catch (error) {
        console.log(error.message);
    }
}


const editBanner = async (req, res) => {
    try {
        const Id = req.query.id
        console.log(Id);

        const banner = await Banner.findOne({ _Id: Id })
        console.log(banner);


        if (banner) {

            console.log("success");
            res.render('editbanner', { banner })
        }

    } catch (error) {
        console.log(error.message);
        console.log("kljhvcvx");
    }
}
const blockbanner = async (req, res) => {
    try {
        const Id = req.body.bannerId
        console.log(Id, "banner id");
        console.log(Id, "id vanuuu");
        Disable = await Banner.findOne({ _id: Id }, { block: 1, _id: Id })
        console.log("banner block");
        if (Disable.block === true) {
            console.log("inside disable true");
            const disable = await Banner.findByIdAndUpdate({ _id: Id }, { $set: { block: false } })

            res.json({ success: true })
        }
        else {
            const enable = await Banner.findByIdAndUpdate({ _id: Id }, { $set: { block: true } })

            res.json({ success: true })
        }


    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadbanner,
    loadBannerCaro,
    insertBannerCaro,
    editBanner,
    blockbanner,

}