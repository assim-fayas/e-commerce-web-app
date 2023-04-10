const mongoose = require("mongoose");
const path = require('path')
const env = require('dotenv').config();
const multer = require('multer')

mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce");

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


app.listen(port = 3000, () => {

    console.log(`server is  running at port:${port}`);
});

