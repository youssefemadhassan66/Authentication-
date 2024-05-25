//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongooose = require("mongoose");
const app = express();
var md5 = require('md5');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongooose.connect("mongodb://localhost:27017/userDB");
 
const userSchema = new mongooose.Schema({
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    }
})

const User = mongooose.model("User",userSchema);


// Get routs //

app.get("/" ,async function(req,res){
    res.render("home");
});


app.get("/login" ,async function(req,res){
    res.render("login");
})

app.get("/register",async function(req,res){
    res.render("register");
})


// post routs //
app.post("/register" ,async function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:md5(req.body.password)
    });
    try{
        newUser.save();
        res.render("secrets");
    }
    catch(err){
        console.log(err).send("Try again problem while registering");
    }
});
app.post("/login", async function(req, res) {
    const userName = req.body.username;
    const password = md5(req.body.password);
    
    try {
        const user = await User.findOne({ email: userName });
        
        if (!user) {
            return res.status(401).send("No user found with this email. Please register first.");
        }
        
        if (user.password !== password) {
            return res.status(401).send("Incorrect password.");
        }
        
        res.render("secrets");
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while processing your request.");
    }
});



app.listen(3000 , function(){
    console.log("listening to port 3000");
} )