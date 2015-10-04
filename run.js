var http = require("http");
var irc = require("irc");
var pjson = require("./package.json");
var config = require("./dumbdumb_modules/config");
var fs = require('fs');

var bot = new irc.Client(config.server, config.nick, config);
require("./dumbdumb_modules/module.js")(bot);

fs.readFile('./index.html', function (err, html) {
  if (err) {
    throw err;
  }
  http.createServer(function(request, response) {
    console.log("Connected");
    response.writeHeader(200, {"Content-Type": "text/html"});
    response.write(html);
    response.end();
  }).listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 10024, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
});
