require("dotenv").config();

const express = require("express");
const server = express();
const port = process.env.PORT || 5000;
const routes = require("./router/routes");
const pool = require("./passport/pool");

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

server.use(
  session({
    store: new pgSession({
      pool: pool,
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  }),
);

server.use(express.urlencoded({ extended: false }));
server.use("/", routes);

function err(error) {
  if (error) {
    return console.log("big server whomp :(");
  }
  console.log("no server whomp!");
}

server.listen(port, err);
