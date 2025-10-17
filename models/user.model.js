// import mongoose
const mongoose = require("mongoose");
const generate = require("../helpers/generate");

//Create Schema(bo khung) new
const userSchema = new mongoose.Schema({
  fullName: String, 
  email: String,
  password: String,
  tokenUser: {
    type: String,
    default: generate.generateRandomString(20)
  },
  phone: String,
  avatar: String,
  status: {
    type: String,
    default: "active"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt: Date
}, {
  timestamps:true
});

// 'Product' is model (.model to khoi tao), tham số 3 là table in DB
const User = mongoose.model("User", userSchema, "users");


module.exports = User;
