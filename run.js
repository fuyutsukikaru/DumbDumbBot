var irc = require("irc");
var config = require("./dumbdumb_modules/config");
var express = require("express");
var app = express();

var bot = new irc.Client(config.server, config.nick, config);
require("./dumbdumb_modules/module.js")(bot);

app.listen(8080, function() {
  console.log('Started DumbDumbBot on port 8080');
});
