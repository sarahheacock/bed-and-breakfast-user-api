'use strict';

var express = require("express");
var router = express.Router();
var User = require("./models").User;

router.param("userID", function(req, res, next, id){
  //User.findById(id, function(err, doc){
  User.findOne({email: id}).exec(function(err, doc){
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
  req.upcoming = req.user.upcoming.id(id);
  if(!req.upcoming){
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

//============================================================

//get all users
router.get("/", function(req, res){
  User.find({})
    .sort({createdAt: -1})
    .exec(function(err, user){
      if(err) return next(err);
      res.json(user);
    });
});

//create new user
router.post("/", function(req, res, next){
  var user = new User(req.body);
  user.save(function(err, user){
    if(err) return next(err);
    res.status(201);
    res.json(user);
  });
});

//get user information
router.get("/:userID", function(req, res, next){
  res.json(req.user);
});

//make new reservation
router.post("/:userID/upcoming", function(req, res, next){
  req.user.upcoming.push(req.body);
  req.user.save(function(err, user){
    if(err) return next(err);
    res.status(201);
    res.json(user);
  });
});

// //update user
// router.put("/:userID/", function(req, res){
//   req.upcoming.update(req.body, function(err,result){
//     if(err) return next(err);
//     res.json(result);
//   });
// });

//cancel reservation
router.delete("/:userID/upcoming/:upcomingID", function(req, res){
  req.upcoming.remove(function(err){
    req.user.save(function(err, user){
      if(err) return next(err);
      res.json(user);
    });
  });
});




module.exports = router;
