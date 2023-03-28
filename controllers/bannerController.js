const mongoose = require("mongoose");
const Joi = require("joi")

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

        const banner = await Banner.findOne({ _Id:Id })
        console.log(banner);


        if (banner) {

            console.log("success");
            res.render('editbanner',{banner})
        }

    } catch (error) {
        console.log(error.message);
        console.log("kljhvcvx");
    }
}

module.exports = {
    loadbanner,
    loadBannerCaro,
    insertBannerCaro,
    editBanner
}