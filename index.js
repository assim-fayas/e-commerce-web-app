const mongoose = require("mongoose");
const path=require('path')

mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce");

const express = require("express");

const app = express()

//for user routes
app.use(express.static(path.join(__dirname, "assets")));
const userRoute= require("./routes/userRoute");

app.use('/',userRoute)



app.listen(port = 3000, function () {

    console.log(`server is  running at port:${port}`);
});

