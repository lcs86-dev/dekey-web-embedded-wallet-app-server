"use strict";
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const hpp = require("hpp");

const controller = require("../controller");
const error_handler = require("./error_handler");

app.use(cors());

app.use(express.static(path.join(__dirname, "/..", "/public")));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
app.use(bodyParser.json({ limit: "1mb" }));

app.use(helmet());
app.use(hpp());

app.get("/", (req, res) => {
  res.write("Under construction");
  res.end();
});

app.get("/api/health-check", (req, res) => {
  return res.status(200).json();
});

app.use("/api/v1/user", controller.userRouter);
app.use("/api/v1/address", controller.addressRouter);

app.use(error_handler);

module.exports = app;
