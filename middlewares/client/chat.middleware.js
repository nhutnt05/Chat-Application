const RoomChat = require("../../models/room-chat.model")

module.exports.checkAccess = async (req, res, next) => {
  const userId = res.locals.user.id;
  const roomChatId = req.params.roomChatId;

  try {
    const checkAccess = await RoomChat.findOne({
      _id: roomChatId,
      "users.user_id": userId,
      deleted: false
    });

    if (checkAccess) {
      next();
    }
    else {
      res.redirect(`/`);
    }
  } catch (error) {
    res.redirect(`/`);
  }






}