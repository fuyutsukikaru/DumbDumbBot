var gfeed = require('google-feed-api');
var irc = require('irc');

function colorize(text) {
  return irc.colors.wrap("light_magenta", text, "light_magenta");
};

function feedstart(bot, url, receiver) {
  var initial = true;
  if (url != "") {
    var last = "";
    var feed = new gfeed.Feed(url);
    (function repeat() {
      feed.listItems(function(items) {
        var data = items[0].title + " " + items[0].link;
        if (data != last) {
          console.log(data);
          if (!initial) {
            bot.say(receiver, colorize(data));
          } else
            initial = false;
          last = data;
        } else {
          console.log("Nothing new");
        }
        setTimeout(repeat, 60000);
      });
    })();
  }
}

exports.repeat = feedstart;
