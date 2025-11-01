const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {

  // id of oneself 
  const userId = res.locals.user.id;

  
  // List Room Chat of myuser
  const listRoomChat = await RoomChat.find({
    "users.user_id": userId,
    typeRoom: "group",
    deleted: false
  })

 
  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng",
    listRoomChat: listRoomChat
  });
}

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList;

  for (const friend of friendList) {
    const infoUserFriend = await User.findOne({
      _id: friend.user_id
    }).select("fullName avatar");

    friend.infoUserFriend = infoUserFriend;
  }

  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng",
    friendList: friendList
  });
}

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const userId = req.body.usersId;

  const roomChat = {
    title: title,
    typeRoom: "group",
    users: []
  }

  userId.forEach(user_id => {
    roomChat.users.push({
      user_id: user_id,
      role: "user",
    });
  });

  roomChat.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin",
  });

  const room = new RoomChat(roomChat);
  await room.save();

  res.redirect(`/messages/${room.id}`);

}