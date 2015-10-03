var http = require("http");
var irc = require("irc");
var pjson = require("./package.json");
var config = require("./dumbdumb_modules/config");

var bot = new irc.Client(config.server, config.nick, config);
require("./dumbdumb_modules/module.js")(bot);

http.createServer(function(request, response) {
  console.log("Connected");
}).listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
