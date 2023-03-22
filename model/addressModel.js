const mongoose = require('mongoose')
const addressSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    houseAddress:{
        type:String,
        required:true
    },
    streetAddress:{
        type:String,
        required:true
    },
    landMark:{
        type:String,

    },
    cityName:{
        type:String,
        required:true
    },
    state:{
        type:String
    }

})

//user Address schema
const userAddress = mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    userAddresses:{
        type:[addressSchema]
    }
}
,{timestamps : true})

module.exports = mongoose.model('Address',userAddress)