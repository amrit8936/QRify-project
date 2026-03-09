
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.get("/",(req,res)=>{
res.redirect("/login");
});

router.get("/signup",(req,res)=>{
res.render("signup");
});

router.post("/signup",async(req,res)=>{

const {name,email,password} = req.body;

const hash = await bcrypt.hash(password,10);

await User.create({
name,
email,
password:hash
});

res.redirect("/login");

});

router.get("/login",(req,res)=>{
res.render("login");
});

router.post("/login",async(req,res)=>{

const {email,password} = req.body;

const user = await User.findOne({email});

if(!user) return res.send("User not found");

const valid = await bcrypt.compare(password,user.password);

if(!valid) return res.send("Wrong password");

const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

res.cookie("token",token);

res.redirect("/qr/dashboard");

});

router.get("/logout",(req,res)=>{

res.clearCookie("token");
res.redirect("/login");

});

module.exports = router;
