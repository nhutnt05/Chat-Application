const userMiddleware = require("../../middlewares/client/user.middleware");
//import route of product
const homeRoutes = require("./home.route");
const UserRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
const authMiddleware = require("../../middlewares/client/auth.middleware");

module.exports = (app) => {
  // Luôn gọi middleware này trước khi vào các route bên dưới

  app.use(userMiddleware.infoUser);

  app.use('/', homeRoutes);

  app.use('/user', UserRoutes);

  app.use('/chat', authMiddleware.requireAuth, chatRoutes);


}