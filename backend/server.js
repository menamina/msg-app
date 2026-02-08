require("dotenv").config();

const express = require("express");
const server = express();
const port = process.env.PORT || 5000;
const routes = require("./router/routes");
const err = (error) => {
  if (error) {
    return console.log("big server whomp :(");
  }
  console.log("no server whomp!");
};

server.use(express.urlencoded({ extended: false }));
server.use("/", routes);

server.listen(port, err);
