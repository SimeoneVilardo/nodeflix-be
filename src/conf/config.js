const path = require("path");
const config = {};

config.dir = {};
config.mime_types = {};
config.error = {};

config.debug = process.env.NODE_ENV === "development";

config.pwd = "332918ec6c5cbba13bf2dc7871d21ecd";

config.dir.base = path.join(__dirname, "..");
config.dir.videos = path.join(config.dir.base, "videos");
config.dir.subs = path.join(config.dir.base, "subs");

config.mime_types.mp4 = "video/mp4";
config.mime_types.avi = "video/x-msvideo";
config.mime_types.flv = "video/x-flv";
config.mime_types.m4v = "video/mp4";
config.mime_types.mkv = "video/x-matroska";

config.error.bad_request = {
  message:
    "The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing)",
  status: 400,
};
config.error.unauthorized = { message: "The request has not been applied because it lacks valid authentication credentials for the target resource", status: 401 };
config.error.forbidden = { message: "The server understood the request but refuses to authorize it", status: 403 };
config.error.not_found = { message: "Resource not found", status: 404 };
config.error.maintenance = {
  message: "The server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay",
  status: 503,
};
config.error.unknown = { message: "Unknown error", status: 500 };

module.exports = config;
