// import mongoose
const mongoose = require("mongoose");

//Create Schema(bo khung) new
const chatSchema = new mongoose.Schema({
  user_id: String,
  room_chat_id: String,
  content: String,
  images: Array,
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt: Date
}, {
    timestamps: true
  });

const Chat = mongoose.model("Chat", chatSchema, "chats");


module.exports = Chat;
