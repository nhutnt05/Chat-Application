const User = require("../../models/user.model");

module.exports = async (res) => {
  _io.once('connection', (socket) => {
    // User send add friend request
    socket.on("client_add_friend", async (userId) => {
      // userId of friend to add

      // myIdUser is id of myuser
      const myIdUser = res.locals.user.id;

      // Add myIduser to acceptFriends of that userId 
      const exitUserMytoYou = await User.findOne({
        _id: userId,
        acceptFriends: myIdUser
      });

      if (!exitUserMytoYou) {
        await User.updateOne({
          _id: userId
        }, {
          $push: { acceptFriends: myIdUser }
        })
      }

      // Add userId to requestFriends of myIdUser
      const exitUserYoutoMy = await User.findOne({
        _id: myIdUser,
        requestFriends: userId
      });

      if (!exitUserYoutoMy) {
        await User.updateOne({
          _id: myIdUser
        }, {
          $push: { requestFriends: userId }
        })
      }
      // Get length acceptFriends userId return userId
      const infoUser = await User.findOne({
        _id: userId
      });

      const lengthAcceptFriends = infoUser.acceptFriends.length;

      socket.broadcast.emit("server_return_length_accept_friend", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends
      });


    });

    // User send cancel friend request
    socket.on("client_cancel_friend", async (userId) => {
      // userId of friend to add

      // myIdUser is id of myuser
      const myIdUser = res.locals.user.id;

      // Remove myIdUser from acceptFriends of userId
      const exitUserMytoYou = await User.findOne({
        _id: userId,
        acceptFriends: myIdUser
      });

      if (exitUserMytoYou) {
        await User.updateOne({
          _id: userId
        }, {
          $pull: { acceptFriends: myIdUser }
        })
      }

      // Remove userId to requestFriends of myIdUser
      const exitUserYoutoMy = await User.findOne({
        _id: myIdUser,
        requestFriends: userId
      });

      if (exitUserYoutoMy) {
        await User.updateOne({
          _id: myIdUser
        }, {
          $pull: { requestFriends: userId }
        })
      }


    });

    // User refuse friend request
    socket.on("client_refuse_friend", async (userId) => {
      // userId of friend to refuse

      // myIdUser is id of myuser
      const myIdUser = res.locals.user.id;

      // Remove userId from acceptFriends of myIdUser
      const exitUserMytoYou = await User.findOne({
        _id: myIdUser,
        acceptFriends: userId
      });

      if (exitUserMytoYou) {
        await User.updateOne({
          _id: myIdUser
        }, {
          $pull: { acceptFriends: userId }
        })
      }

      // Remove myIdUser to requestFriends of userId
      const exitUserYoutoMy = await User.findOne({
        _id: userId,
        requestFriends: myIdUser
      });

      if (exitUserYoutoMy) {
        await User.updateOne({
          _id: userId
        }, {
          $pull: { requestFriends: myIdUser }
        })
      }


    });

    // User accept friend request
    socket.on("client_accept_friend", async (userId) => {
      // userId of friend to refuse

      // myIdUser is id of myuser
      const myIdUser = res.locals.user.id;


      // Add user_id of userId into friendList of myIdUser
      // Remove userId from acceptFriends of myIdUser
      const exitUserMytoYou = await User.findOne({
        _id: myIdUser,
        acceptFriends: userId
      });

      if (exitUserMytoYou) {
        await User.updateOne({
          _id: myIdUser
        }, {
          $push: {
            friendList: {
              user_id: userId,
              room_chat_id: ""
            }
          },
          $pull: { acceptFriends: userId }
        })
      }

      // Add user_id of myIdUser into friendList of userId
      // Remove myIdUser to requestFriends of userId
      const exitUserYoutoMy = await User.findOne({
        _id: userId,
        requestFriends: myIdUser
      });

      if (exitUserYoutoMy) {
        await User.updateOne({
          _id: userId
        }, {
          $push: {
            friendList: {
              user_id: myIdUser,
              room_chat_id: ""
            }
          },
          $pull: { requestFriends: myIdUser }
        })
      }


    });


  });
}
