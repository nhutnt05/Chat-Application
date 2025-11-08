const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

module.exports = async (res) => {
  _io.once("connection", (socket) => {
    // User send add friend request
    socket.on("client_add_friend", async (userId) => {
      // userId of friend to add

      // myIdUser is id of myuser
      const myIdUser = res.locals.user.id;

      // Add myIduser to acceptFriends of that userId
      const exitUserMytoYou = await User.findOne({
        _id: userId,
        acceptFriends: myIdUser,
      });

      if (!exitUserMytoYou) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriends: myIdUser },
          }
        );
      }

      // Add userId to requestFriends of myIdUser
      const exitUserYoutoMy = await User.findOne({
        _id: myIdUser,
        requestFriends: userId,
      });

      if (!exitUserYoutoMy) {
        await User.updateOne(
          {
            _id: myIdUser,
          },
          {
            $push: { requestFriends: userId },
          }
        );
      }

      // Get length acceptFriends userId return userId
      const infoUser = await User.findOne({
        _id: userId,
      });

      const lengthAcceptFriends = infoUser.acceptFriends.length;

      socket.broadcast.emit("server_return_length_accept_friend", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });

      // Get info of myUserId for UserId(info data accept) ( A for B)
      const infoMyUserId = await User.findOne({
        _id: myIdUser,
      }).select("id avatar fullName");

      socket.broadcast.emit("server_return_info_accept_friend", {
        userId: userId,
        infoMyUserId: infoMyUserId,
      });
    });

    // User cancel friend request
    socket.on("client_cancel_friend", async (userId) => {
      // userId of friend to add

      // myIdUser is id of myuser
      const myIdUser = res.locals.user.id;

      // Remove myIdUser from acceptFriends of userId
      const exitUserMytoYou = await User.findOne({
        _id: userId,
        acceptFriends: myIdUser,
      });

      if (exitUserMytoYou) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriends: myIdUser },
          }
        );
      }

      // Remove userId to requestFriends of myIdUser
      const exitUserYoutoMy = await User.findOne({
        _id: myIdUser,
        requestFriends: userId,
      });

      if (exitUserYoutoMy) {
        await User.updateOne(
          {
            _id: myIdUser,
          },
          {
            $pull: { requestFriends: userId },
          }
        );
      }

      // Get length Accept userId
      const infoUser = await User.findOne({
        _id: userId,
      });

      const lengthAcceptFriends = infoUser.acceptFriends.length;

      socket.broadcast.emit("server_return_length_accept_friend", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });

      // Get id of myUserId send userId
      socket.broadcast.emit("server_return_user_id_cancel_friend", {
        userId: userId,
        myIdUser: myIdUser,
      });
    });

    // User refuse friend request
    socket.on("client_refuse_friend", async (userId) => {
      // userId of friend to refuse

      // myIdUser is id of myuser
      const myIdUser = res.locals.user.id;

      // Remove userId from acceptFriends of myIdUser
      const exitUserMytoYou = await User.findOne({
        _id: myIdUser,
        acceptFriends: userId,
      });

      if (exitUserMytoYou) {
        await User.updateOne(
          {
            _id: myIdUser,
          },
          {
            $pull: { acceptFriends: userId },
          }
        );
      }

      // Remove myIdUser to requestFriends of userId
      const exitUserYoutoMy = await User.findOne({
        _id: userId,
        requestFriends: myIdUser,
      });

      if (exitUserYoutoMy) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriends: myIdUser },
          }
        );
      }
    });

    // User accept friend request
    socket.on("client_accept_friend", async (userId) => {
      // userId of friend to accept

      // myIdUser is id of myuser
      const myIdUser = res.locals.user.id;

      // Get userExist
      const exitUserMytoYou = await User.findOne({
        _id: myIdUser,
        acceptFriends: userId,
      });
      const exitUserYoutoMy = await User.findOne({
        _id: userId,
        requestFriends: myIdUser,
      });

      let roomChat;
      // Create Room Chat
      if (exitUserMytoYou && exitUserYoutoMy) {
        roomChat = new RoomChat({
          typeRoom: "friend",
          users: [
            {
              user_id: userId,
              role: "superAdmin",
            },
            {
              user_id: myIdUser,
              role: "superAdmin",
            },
          ],
        });

        await roomChat.save();
      }

      // Add user_id of userId into friendList of myIdUser
      // Remove userId from acceptFriends of myIdUser

      if (exitUserMytoYou) {
        await User.updateOne(
          {
            _id: myIdUser,
          },
          {
            $push: {
              friendList: {
                user_id: userId,
                room_chat_id: roomChat.id,
              },
            },
            $pull: { acceptFriends: userId },
          }
        );
      }

      // Add user_id of myIdUser into friendList of userId
      // Remove myIdUser to requestFriends of userId

      if (exitUserYoutoMy) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              friendList: {
                user_id: myIdUser,
                room_chat_id: roomChat.id,
              },
            },
            $pull: { requestFriends: myIdUser },
          }
        );
      }

      socket.broadcast.emit("server_return_accept_friend", {
        userId: userId,
        myIdUser: myIdUser,
      });
    });

    //User Unfriend
    socket.on("client_unfriend_server", async (userId) => {

      const myIdUser = res.locals.user.id;

      const myUser = await User.findOne({
        _id: myIdUser,
        friendList: {
          $elemMatch: { user_id: userId }
        }
      });


      const userFriend = await User.findOne({
        _id: userId,
        friendList: {
          $elemMatch: { user_id: myIdUser }
        }
      });

      if (myUser && userFriend) {
        await User.updateOne(
          { _id: userId },
          { $pull: { friendList: { user_id: myIdUser } } }
        );

        await User.updateOne(
          { _id: myIdUser },
          { $pull: { friendList: { user_id: userId } } }
        );
      }
    });




  });
};

