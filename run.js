var irc = require("irc"), fs = require("fs");
var pjson = require("./package.json");
var config = require("./config");
var twitter = require("./twit");
var express = require("express");
var app = express();

// Setup middleware
app.use(express.cookieParser('tweet much?'));
app.use(express.session());
app.use(express.static(__dirname));

var bot = new irc.Client(config.server, config.nick, config);
fs.readdirSync("./dumbdumb_modules").forEach(function(file) {
	require("./dumbdumb_modules/" + file)(bot);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
