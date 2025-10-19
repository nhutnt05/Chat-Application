const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET]/chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  // SocketIO
  _io.once('connection', (socket) => {
    // Listen client send message
    socket.on("client_send_message", (content) => {
      // Save message to database
      const newChat = new Chat({
        user_id: userId,
        content: content,
      });
      newChat.save();
    });
    // End SocketIO
  });

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