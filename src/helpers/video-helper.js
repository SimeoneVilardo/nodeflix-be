const videoHelper = {};
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const config = require("../conf/config");

videoHelper.videos = {};

videoHelper.loadVideos = () => {
  if (!fs.existsSync(config.dir.videos)) fs.mkdirSync(config.dir.videos);
  if (!fs.existsSync(config.dir.subs)) fs.mkdirSync(config.dir.subs);
  var filenames = fs.readdirSync(config.dir.videos);
  for (var filename of filenames) {
    var hash = crypto.createHash("md5").update(filename).digest("hex");
    var subIta = fs.existsSync(videoHelper.getSubtitleFilepath(filename, "ita"));
    var subEng = fs.existsSync(videoHelper.getSubtitleFilepath(filename, "eng"));
    videoHelper.videos[hash] = { hash: hash, filename: filename, subs: { ita: subIta, eng: subEng } };
  }
};

videoHelper.getVideoFilepath = (filename) => {
  var filepath = path.join(config.dir.videos, filename);
  return filepath;
};

videoHelper.getSubtitleFilepath = (filename, lan) => {
  var name = path.parse(filename).name;
  var ext = path.parse(filename).ext.replace(".", "");
  var filepath = path.join(config.dir.subs, `${name}.${ext}.${lan}.srt`);
  return filepath;
};

videoHelper.getVideoContentType = (filename) => {
  var ext = path.extname(filename).replace(".", "").toLowerCase();
  var contentType = config.mime_types[ext];
  return contentType;
};

module.exports = videoHelper;
