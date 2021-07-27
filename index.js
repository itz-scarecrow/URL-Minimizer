const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const dotenv=require("dotenv");
var bodyParser = require('body-parser')
const shortId=require("shortid");
const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config({ path: './config/config.env' })
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const urlSchema= new mongoose.Schema({
  full:{
    type:String,
    required:true
  },
  short:{
    type:String,
    required:true,
    default: shortId.generate
  },
  clicks:{
    type:Number,
    required:true,
    default:0
  }
});
const Url = mongoose.model('Url', urlSchema);

app.get("/",function(req,res){
  Url.find({}, function (err, New) {
    if(err){
      console.log(err);
    }
    else{
      console.log()
      res.render("font",{Urls:New});
    }
  });
});
app.post("/shortUrls",function(req,res){
  const Url1=new Url({
    full: req.body.myurl
  });
  Url1.save((err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Successfully Saved");
    }
  });
  res.redirect("/");
});
app.get("/:shortUrl", async(req,res)=>{
  const shortUrl = await Url.findOne({ short: req.params.shortUrl });
  if(shortUrl === null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log("It has started");
});