const mongoose = require("mongoose");
const path = require('path')
const env = require('dotenv').config();
const multer = require('multer')

mongoose.connect("mongodb+srv://contactasim000:a1s2i1m2@cluster0.vdvoplq.mongodb.net/Ecommerce");

const express = require("express");

const app = express();

const { dirname } = require('path')


//for user routes
app.use(express.static(path.join(__dirname, "assets")));
const userRoute = require("./routes/userRoute");
app.use('/', userRoute)

//for admin routes
app.use(express.static(path.join(__dirname, "assets")));
const adminRoute = require("./routes/adminRoute");
const bodyParser = require("body-parser");
app.use('/admin', adminRoute)

const { sessionSecret } = require('./config/config')





app.use((req,res)=>{
    res.status(404).render("404")
})


app.listen(port = 3000, () => {

    console.log(`server is  running at port:${port}`);
});

