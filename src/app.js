var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var videoHelper = require("./helpers/video-helper");

var indexRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next({ status: 404, message: "Not found" });
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json(err);
});

videoHelper.loadVideos();

module.exports = app;
