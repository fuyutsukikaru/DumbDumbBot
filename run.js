var irc = require("irc"), fs = require("fs");
var pjson = require("./package.json");
var config = require("./config");

var bot = new irc.Client(config.server, config.nick, config);
fs.readdirSync("./dumbdumb_modules").forEach(function(file) {
	require("./dumbdumb_modules/" + file)(bot);
});
