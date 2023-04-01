
const mongoose=require('mongoose')
const bannerSchema=new mongoose.Schema({
image:{
    type:Array,
    required:true
},
type:{
    type:String,
    required:true

},
description:{
    type:String,
    required:true
},
block:{
    type:Boolean,
    default:true
}

})

module.exports=mongoose.model('Banner',bannerSchema)