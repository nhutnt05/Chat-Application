const User = require("../../models/user.model");

const socketUsers = require('../../sockets/client/users.socket');
// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  // Socket
  socketUsers(res);
  // End SocketIO (Server)

  const userId = res.locals.user.id;

  const myUser = await User.findOne({ _id: userId });

  const requestFriends = myUser.requestFriends;

  const friendId = [];
  myUser.friendList.forEach(item => {
    friendId.push(item.user_id);
  });

  const acceptFriends = myUser.acceptFriends;
  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      {_id:  { $nin: friendId}}
    ],
    status: "active",
    deleted: false,
   
  }).select("avatar fullName");


  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users
  });
}

// [GET] /users/request
module.exports.request = async (req, res) => {
  // Socket
  socketUsers(res);
  // End SocketIO (Server)

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId
  });

  const requestFriends = myUser.requestFriends;

  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users
  });
}

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  // Socket
  socketUsers(res);
  // End SocketIO (Server)

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId
  });

  const acceptFriend = myUser.acceptFriends;

  const users = await User.find({
    _id: { $in: acceptFriend },
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/accept", {
    pageTitle: "Lời mời kết bạn",
    users: users
  });

}