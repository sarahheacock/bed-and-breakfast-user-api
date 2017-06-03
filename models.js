'use strict';

var RoomList = require('./data/roomList');

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const temp = new Date().toString().split(' ');
const NOW = new Date(temp[0] + " " + temp[1] + " " + temp[2] + " " + temp[3] + " 10:00:00").getTime();

var UpcomingSchema = new Schema({
  arrive: Number,
  depart: Number,
  guests: Number,
  room: String,
});

var UserSchema = new Schema({
  email: String,
  password: String,
  billing: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  upcoming: [UpcomingSchema],
});

UserSchema.pre("save", function(next){
  next();
});

var User = mongoose.model("User", UserSchema);

module.exports.User = User;
