const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const uploadToCloudinary = require('../../helpers/uploadToCloudinary');

// [GET]/chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  // SocketIO (Server)
  _io.once('connection', (socket) => {
    // Listen client send message(object data)
    socket.on("client_send_message", async (data) => {
      
      let images = [];
      for(const itemImageBuffer of data.images){
        const linkImage = await uploadToCloudinary(itemImageBuffer);
        images.push(linkImage);
      }
      
      // Save message to database
      const newChat = new Chat({
        user_id: userId,
        content: data.content,
        images: images
      });
      await newChat.save();

      // Return data to the clients(Return Realtime)-objects
      _io.emit("server_return_message", {
        user_id: userId,
        fullName: fullName,
        content: data.content,
        images: images
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