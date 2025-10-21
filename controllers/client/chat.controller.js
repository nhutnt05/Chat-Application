const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET]/chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  // SocketIO (Server)
  _io.once('connection', (socket) => {
    // Listen client send message
    socket.on("client_send_message", async (content) => {
      // Save message to database
      const newChat = new Chat({
        user_id: userId,
        content: content,
      });
      await newChat.save();

      // Return data to the clients(Return Realtime)-objects
      _io.emit("server_return_message", {
        user_id: userId,
        fullName: fullName,
        content: content,
      })
    });

    socket.on("client_send_typing", (type) => {
      socket.broadcast.emit("server_return_typing", {
        user_id: userId,
        fullName: fullName,
        type: type,
      });
    });


  });
  // End SocketIO


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