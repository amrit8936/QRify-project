
const express = require("express");
const QRCode = require("qrcode");

const QR = require("../models/QR");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard",auth,async(req,res)=>{

const qrs = await QR.find({userId:req.user.id});

res.render("dashboard",{qrs});

});

router.get("/generate",auth,(req,res)=>{

res.render("generate",{qrImage:null});

});

router.post("/generate",auth,async(req,res)=>{

const {text,type,expiry,password,oneTime} = req.body;

const qr = await QR.create({

userId:req.user.id,
text,
type,
expiryDate:expiry || null,
password:password || null,
oneTime:oneTime==="on"

});

const link = `http://localhost:5000/qr/r/${qr._id}`;

const qrImage = await QRCode.toDataURL(link);

res.render("generate",{qrImage});

});

router.get("/r/:id",async(req,res)=>{

const qr = await QR.findById(req.params.id);

if(!qr || !qr.isActive) return res.send("QR inactive");

if(qr.expiryDate && new Date() > qr.expiryDate){
return res.send("QR expired");
}

if(qr.password){
return res.render("qr-password",{id:qr._id});
}

qr.scanCount++;

if(qr.oneTime){
qr.isActive=false;
}

await qr.save();

res.redirect(qr.text);

});

router.post("/unlock/:id",async(req,res)=>{

const {password} = req.body;

const qr = await QR.findById(req.params.id);

if(qr.password !== password){
return res.send("Wrong password");
}

qr.scanCount++;
await qr.save();

res.redirect(qr.text);

});

module.exports = router;
