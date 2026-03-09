
const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

text:String,
type:String,

scanCount:{
type:Number,
default:0
},

expiryDate:Date,

password:String,

oneTime:{
type:Boolean,
default:false
},

isActive:{
type:Boolean,
default:true
},

createdAt:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("QR",qrSchema);
