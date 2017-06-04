'use strict';

//dependencies
var express = require("express");
var app = express();
var routes = require("./routes");
var jsonParser = require("body-parser").json;
var mongoose = require("mongoose");
var logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());
//mongoose.connect("mongodb://localhost:27017/user");
mongoose.connect('mongodb://heroku_txrpvqtk:rh0931h9dff6bimb8a5lglbsg8@ds161901.mlab.com:61901/heroku_txrpvqtk');

var db = mongoose.connection;

db.on("error", function(err){
  console.error("connection error:", err);
});

db.once("open", function(){
  console.log("db connection successful");
});

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.method === "OPTIONS"){
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET");
    return res.status(200).json({});
  }
  next();
});

//routes
app.use("/user", routes);

//catch 404 and forward to error handler
app.use(function(req, res, next){
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Error Handler
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("Express server is listening on port ", port);
});
