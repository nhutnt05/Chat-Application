const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
// const uploadToCloudinary = require('../../helpers/uploadToCloudinary');

const socketChat = require('../../sockets/client/chat.socket');
// [GET]/chat/
module.exports.index = async (req, res) => {
  
  // SocketIO (Server)
  
  // End SocketIO
  socketChat(res);

  // Get Data Chat from Databases
  const chats = await Chat.find({
    deleted: false
  })

  for (const item of chats) {
    const infoUser = await User.findOne({
      _id: item.user_id,
    }).select("fullName");
    item.infoUser = infoUser;
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats
  });


}