'use strict';

var express = require("express");
var router = express.Router();

var User = require("./models").User;

var RoomList = require('./data/roomList');


router.param("userID", function(req, res, next, id){
  User.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }

    req.user = doc;
    return next();
  });
});

router.param("upcomingID", function(req,res,next,id){
  req.answer = req.user.upcoming.id(id);
  if(!req.answer){
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

router.get("/", function(req, res){
  User.find({})
    .exec(function(err, user){
      if(err) return next(err);
      res.json(user);
    });
});

router.post("/", function(req, res, next){
  var user = new User(req.body);
  user.save(function(err, user){
    if(err) return next(err);
    res.status(201);
    res.json(user);
  });
});

router.get("/:userID", function(req, res, next){
  res.json(req.user);
});


module.exports = router;
