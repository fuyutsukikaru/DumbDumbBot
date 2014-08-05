var twitter = require('../twitter.js');
var sakis = require('../sakis.js');
var irc = require("irc");

function colorize(text) {
  return irc.colors.wrap("light_magenta", text, "light_magenta");
};

module.exports = function(bot) {
  bot.addListener("ping", function(server) {
    // Wake up from idle
  });
  bot.addListener("join", function(channel, nick, message) {
    if (nick == "Meball") {
      bot.say(channel, colorize("HI " + nick.toUpperCase()));
    }
    if (nick == "LoliSenpai" || nick == "Restinya") {
      bot.say(channel, colorize("Go away Nick, you're dumber than me."));
    }
  });
  // Listen for any message, say to him/her in the room
  bot.addListener("message", function(from, to, text, message) {
    var arr = text.split(" ", 2);
    var command = arr[0];
    var rest = text.substr(text.indexOf(' ') + 1);
    if (command == "!hi" || command == "!sup") {
      bot.say(to, colorize("Hello, " + from));
      console.log("Success");
    }
    else if (command == "!goaway") {
      bot.say(to, colorize("Go away " + rest));
    }
    else if (command == "!countdown") {
      var number = rest;
      if (number <= 15) {
        bot.say(to, colorize("Starting!"));
        (function counter() {
          if (number > 0) {
            bot.say(to, colorize(number));
            number--;
            setTimeout(counter, 1000);
          }
          else
            bot.say(to, colorize("GO!"));
        })();
      } else if (rest == "next tourney") {
        bot.say(to, colorize("Never."));
      } else {
        bot.say(to, colorize("Hi, I'm too dumb to count from that high."));
      }
    }
    else if (command == "!yakuman") {
      var len = from.length;
      var first = parseInt(from.charAt(0));
      var last = parseInt(from.charAt(len-1));
      var d = new Date();
      var date = parseInt(d.getDate());
      var day = parseInt(d.getDay());
      var val = len * (date + first) * (day + last);
      var hash = val % 13;
      var yakuman = [
        "Kokushi Musou",
        "Daisangen",
        "Shousuushii",
        "Daisuushi",
        "Chuurenpoutou",
        "Suu Ankou",
        "Ryuuiisou",
        "Suu Kantsu",
        "Tsuuiisou",
        "Chinroutou",
        "Tenhou",
        "Chiihou",
        "Renhou"
      ];
      bot.say(to, colorize("Today you should try going for " + yakuman[hash]));
    }
    else if (command == "!tweet") {
      twitter.tweet(rest, bot, to);
    }
    else if (command == "!petite") {
      if (from == "DDK") {
        bot.say(to, colorize("I'm  DEFINITELY not a lolicon, I just like petite girls! *wink wink*"));
      }
      else if (from == "LoliSenpai" || from == "Restinya") {
        bot.say(to, colorize("I'm a lolicon! XD"));
      } else {
        bot.say(to, colorize("I'm not a lolicon, I just like petite girls!"));
      }
    }
    else if (command == "!remind") {
      var time = arr[1];
      if (time == parseInt(time)) {
        var reminder = text.substr(text.indexOf(' ') + 2);
        bot.say(to, colorize("Reminder set for " + from));
        setTimeout(function() { bot.say(to, colorize(from + ": " + reminder)); }, 60000 * time);
      } else {
        bot.say(to, colorize("Need to set a valid number for minutes!"));
      }
    }
    else if (command == "!saki") {
      var characters = sakis.characters;
      var len = from.length;
      var first = parseInt(from.charAt(0));
      var last = parseInt(from.charAt(len-1));
      var d = new Date();
      var date = parseInt(d.getDate());
      var day = parseInt(d.getDay());
      var val = len * (date + first) * (day + last);
      var hash = val % 176;
      var saki = characters[hash];
      bot.say(to, colorize("Your spirit Saki today is " + saki));
      var chars = saki.split(" ", 2);
      if (!chars[1]) {
        bot.say(to, colorize("http://saki.wikia.com/wiki/" + chars[0]));
      } else {
        bot.say(to, colorize("http://saki.wikia.com/wiki/" + chars[0] + "_" + chars[1]));
      }
    }
    else if (command == "!help") {
      bot.say(to, colorize("Enter !hi or !sup to have DumbDumbBot greet you!"));
      bot.say(to, colorize("Enter !goaway <name of person> to have DumbDumbBot be rude to a person."));
      bot.say(to, colorize("Enter !countdown <number> to have DumbDumbBot start a countdown! Limited to numbers under 15."));
      bot.say(to, colorize("Enter !reminder <minutes> <message> to have DumbDumbBot remind you of things."));
      bot.say(to, colorize("Enter !tweet <message to send> to post a tweet."));
      bot.say(to, colorize("Enter !yakuman to have DumbDumbBot tell you what yakuman you should go for today."));
      bot.say(to, colorize("Enter !saki to get your spiritual Saki of the day."));
    }
  });
};
