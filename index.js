const express = require("express");
var path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const moment = require("moment");

const htttp = require("http");
const { Server } = require("socket.io");

require('dotenv').config();

//include file to use require
const database = require("./config/database");

const route = require("./routes/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;


app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// SocketIO
const server = htttp.createServer(app);
// connect socket io to server
const io = new Server(server);
global._io = io;



// Flash
app.use(cookieParser('HAHAHAHAHA'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash


// App Locals Variables(biến này tồn tại in all file pug)
app.locals.moment = moment;

//Use file public to data public (file static)
app.use(express.static(`${__dirname}/public`));


// Routes
route(app);


app.get(/.*/, (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});



server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
