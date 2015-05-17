var http = require("http");
var irc = require("irc");
var pjson = require("./package.json");
var config = require("./dumbdumb_modules/config");

var bot = new irc.Client(config.server, config.nick, config);
require("./dumbdumb_modules/module.js")(bot);

http.createServer(function(request, response) {
  console.log("Connectected");
}).listen(process.env.PORT || 5000);
