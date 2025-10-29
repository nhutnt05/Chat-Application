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



  });
}
