const express = require("express");
const app = express();
const routes = require("../../router/routes");

app.use(express.json());
app.use("/", routes);

module.exports = app;
