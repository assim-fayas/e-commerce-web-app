const mongoose = require("mongoose");
const path = require('path')
 const env =require('dotenv').config();

mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce");

const express = require("express");
// const twillioRouter=require('./src/routes/twilio-sms.js');
const app = express();

const {dirname}=require('path')
// const { PORT }=process.env;
// const port=3000 || PORT;
// const jsonParser=bodyParser.json();
// app.use(jsonParser);
// app.use('/twilio-sms', twillioRouter)

//for user routes
app.use(express.static(path.join(__dirname, "assets")));
const userRoute = require("./routes/userRoute");
app.use('/', userRoute)

//for user routes
app.use(express.static(path.join(__dirname, "assets")));
const adminRoute = require("./routes/adminRoute");
const bodyParser = require("body-parser");
app.use('/admin', adminRoute)

const{sessionSecret}=require('./config/config')

app.listen(port=3000,()=> {

    console.log(`server is  running at port:${port}`);
});

