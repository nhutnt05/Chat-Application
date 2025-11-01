const userMiddleware = require("../../middlewares/client/user.middleware");
//import route of product
const homeRoutes = require("./home.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
const usersRoutes = require("./users.route");
const roomsChatRoutes = require("./rooms-chat.route");

const authMiddleware = require("../../middlewares/client/auth.middleware");

module.exports = (app) => {
  // Luôn gọi middleware này trước khi vào các route bên dưới

  app.use(userMiddleware.infoUser);

  app.use("/", homeRoutes);

  app.use("/user", userRoutes);

  app.use("/messages", authMiddleware.requireAuth, chatRoutes);

  app.use("/users", authMiddleware.requireAuth, usersRoutes);

  app.use("/rooms-chat", authMiddleware.requireAuth, roomsChatRoutes);
};
