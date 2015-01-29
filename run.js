var irc = require("irc"), fs = require("fs");
var pjson = require("./package.json");
var config = require("./dumbdumb_modules/config");
var express = require("express");
var app = express();

// Setup middleware
app.use(express.cookieParser('tweet much?'));
app.use(express.session());
app.use(express.static(__dirname));

var bot = new irc.Client(config.server, config.nick, config);
require("./dumbdumb_modules/module.js")(bot);

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
