require("dotenv").config();

const express = require("express");
const server = express();
const port = process.env.PORT || 5555;
const routes = require("./router/routes");
const pool = require("./passport/pool");
const passport = require("./passport/passport");
const cors = require("cors");

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(
  session({
    store: new pgSession({
      pool: pool,
      createTableIfMissing: true,
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    },
  }),
);

server.use(passport.initialize());
server.use(passport.session());
server.use("/uploads", express.static("uploads"));

server.use("/", routes);

function err(error) {
  if (error) {
    return console.log("big server whomp :(");
  }
  console.log("no server whomp!");
}

server.listen(port, err);
