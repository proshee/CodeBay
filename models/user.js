const mongoose = require("mongoose")

const user = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    avatar : {
        type:String,
        default:"https://cdn.imgbin.com/2/4/15/imgbin-computer-icons-portable-network-graphics-avatar-icon-design-avatar-DsZ54Du30hTrKfxBG5PbwvzgE.jpg"
    },
    role : {
        type:String,
        default:"user",
        enum: ['user','admin']
    },
    favorite: [
        {
            type: mongoose.Types.ObjectId,
            ref:"Books"
        }
    ],
    cart: [
        {
            type: mongoose.Types.ObjectId,
            ref:"Books"
        }
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref:"Order"
        }
    ],

} , {timestamps:true});

// const User = new mongoose.model("user",user)

module.exports = mongoose.model("User",user)