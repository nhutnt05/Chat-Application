const Chat = require("../../models/chat.model");
const RoomChat = require("../../models/room-chat.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  // Id of roomChat
  const roomChatId = req.params.roomChatId;

  _io.on("connection", (socket) => {
    socket.join(roomChatId);

    // Listen client send message(object data)
    socket.on("client_send_message", async (data) => {
      let images = [];
      for (const itemImageBuffer of data.images) {
        const linkImage = await uploadToCloudinary(itemImageBuffer);
        images.push(linkImage);
      }

      // Save message to database
      const newChat = new Chat({
        user_id: userId,
        room_chat_id: roomChatId,
        content: data.content,
        images: images,
      });
      await newChat.save();

      // Return data to the clients(Return Realtime)-objects
      _io.to(roomChatId).emit("server_return_message", {
        user_id: userId,
        fullName: fullName,
        content: data.content,
        images: images,
      });
    });

    socket.on("client_send_typing", (type) => {
      socket.broadcast.to(roomChatId).emit("server_return_typing", {
        user_id: userId,
        fullName: fullName,
        type: type,
      });
    });

    // User Dissolve Group
    socket.on("client_dissolve_group", async (room) => {
      console.log("sss")
      try {
        const roomChat = await RoomChat.findOne({
          _id: room.idRoom,
          users: {
            $elemMatch: {
              user_id: room.userId,
              role: "superAdmin"
            }
          }
        });

        if (roomChat) {
          await RoomChat.updateOne(
            { _id: room.idRoom, },
            {
              deleted: true,
              deleteAt: new Date(),
            }
          );

        }
      } catch (error) {
      }
    });
  });
};
