var irc = require("irc")
var pjson = require("./package.json");
var config = require("./dumbdumb_modules/config");

var bot = new irc.Client(config.server, config.nick, config);
require("./dumbdumb_modules/module.js")(bot);
