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
  // User accept friend with whom
  friendList: [
    {
      user_id: String,
      room_chat_id: String
    }
  ],
  // User that send friend 
  acceptFriends: Array,
  // User this send friend
  requestFriends: Array,
  statusOnline: String,
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
  timestamps: true
});

const User = mongoose.model("User", userSchema, "users");


module.exports = User;
