// import mongoose
const mongoose = require("mongoose");

//Create Schema(bo khung) new
const roomChatSchema = new mongoose.Schema(
  {
    title: String, // title of Group chat
    avatar: String,
    theme: String, //color of roomChat
    typeRoom: String,
    status: String,
    users: [
      {
        user_id: String,
        role: String,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true,
  }
);

const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

module.exports = RoomChat;
