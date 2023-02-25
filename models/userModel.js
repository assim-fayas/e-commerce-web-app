const mongoose=require ("mongoose");

const user=mongoose.Schema({

First_Name:{
    type:String,
    required:true
},
Last_Name:{
    type:String,
    required:true
},
Email:{
    type:String,
    required:true
},
Phone:{
    type:Number,
    required:true
},
Password:{
    type:String,
    required:true
},
Address:{
    type:String,
    required:true
},
City:{
    type:String,
    required:true
},
Post_Code:{
    type:Number,
    required:true
},
State:{
    type:String,
    required:true
},
Country:{
    type:String,
    required:true
}
})
const User=user.model("User",user);
module.exports=User;