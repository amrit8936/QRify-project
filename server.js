
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const path = require("path");

const authRoutes = require("./routes/auth");
const qrRoutes = require("./routes/qr");

const app = express();

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/",authRoutes);
app.use("/qr",qrRoutes);

app.listen(process.env.PORT,()=>{
    console.log("Server running on port "+process.env.PORT);
});
