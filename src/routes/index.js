const express = require("express");
const router = express.Router();
const fs = require("fs");
const srtToVtt = require("srt-to-vtt");
const videoHelper = require("../helpers/video-helper");

router.get("/health", function (req, res, next) {
  res.json({ message: "OK" });
});

router.post("/health", function (req, res, next) {
  res.json({ message: "OK" });
});

router.get("/videos", function (req, res, next) {
  res.json(videoHelper.videos);
});

router.get("/video", function (req, res, next) {
  var hash = req.query.hash;
  res.json(videoHelper.videos[hash]);
});

router.get("/reload", function (req, res, next) {
  videoHelper.loadVideos();
  res.json({ message: "OK" });
});

router.get("/subtitle", function (req, res, next) {
  var hash = req.query.hash;
  var language = req.query.language;
  var filename = videoHelper.videos[hash].filename;
  var filepath = videoHelper.getSubtitleFilepath(filename, language);
  fs.createReadStream(filepath).pipe(srtToVtt()).pipe(res);
});

router.get("/stream", (req, res) => {
  var hash = req.query.hash;
  if (!videoHelper.videos[hash]) throw errHelper.notFound();
  var filename = videoHelper.videos[hash].filename;
  var filepath = videoHelper.getVideoFilepath(filename);
  var stat = fs.statSync(filepath);
  var size = stat.size;
  var range = req.headers.range;
  var contentType = videoHelper.getVideoContentType(filename);
  if (range) {
    var parts = range.replace(/bytes=/, "").split("-");
    var start = parseInt(parts[0], 10);
    var end = parts[1] ? parseInt(parts[1], 10) : size - 1;
    if (start >= size) {
      res.status(416).send("Requested range not satisfiable\n" + start + " >= " + size);
      return;
    }
    var chunksize = end - start + 1;
    var file = fs.createReadStream(filepath, { start, end });
    var head = {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": contentType,
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    var head = {
      "Content-Length": size,
      "Content-Type": contentType,
    };
    res.writeHead(200, head);
    fs.createReadStream(filepath).pipe(res);
  }
});

module.exports = router;
