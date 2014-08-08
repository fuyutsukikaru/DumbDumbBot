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
    else if (nick == "LoliSenpai" || nick == "Restinya") {
      bot.say(channel, colorize("Go away Nick, you're dumber than me."));
    }
    else if (nick == "McNagah") {
      bot.say(channel, colorize("HI NUGGY I LOVE YOU."));
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
      var first = from.charCodeAt(0);
      var last = from.charCodeAt(len-1);
      var d = new Date();
      var date = d.getDate();
      var day = d.getDay();
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
      if (from == "Restinya" || from == "LoliSenpai") {
        bot.say(to, colorize("Today you should try going for pinfu so you can finally learn what it is."));
      } else
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
      var first = from.charCodeAt(0);
      var last = from.charCodeAt(len-1);
      var d = new Date();
      var date = d.getDate();
      var day = d.getDay();
      var val = len * (date + first) * (day + last);
      var hash = val % 176;
      var saki = characters[hash];
      if (from == "Dolphy" || from == "CureRMN") {
        hash = val % 2;
        if (hash == 0)
          saki = characters[2];
        else if (hash == 1)
          saki = characters[105];
      }
      else if (from == "fuyutsukikaru") {
        hash = val % 2;
        if (hash == 0)
          saki = characters[96];
        else if (hash == 1)
          saki = characters[5];
      }
      bot.say(to, colorize("Your spirit Saki today is " + saki));
      var chars = saki.split(" ", 2);
      if (!chars[1]) {
        bot.say(to, colorize("http://saki.wikia.com/wiki/" + chars[0]));
      } else {
        bot.say(to, colorize("http://saki.wikia.com/wiki/" + chars[0] + "_" + chars[1]));
      }
    }
    else if (command == "!roulette") {
      var choices = rest.split(" ");
      var options = choices.length;
      var random = Math.floor((Math.random() * options));
      bot.say(to, colorize("I choose " + choices[random]));
    }
    else if (command == "!help") {
      bot.say(to, colorize("Enter !hi or !sup to have DumbDumbBot greet you!"));
      bot.say(to, colorize("Enter !goaway <name of person> to have DumbDumbBot be rude to a person."));
      bot.say(to, colorize("Enter !countdown <number> to have DumbDumbBot start a countdown! Limited to numbers under 15."));
      bot.say(to, colorize("Enter !remind <minutes> <message> to have DumbDumbBot remind you of things."));
      bot.say(to, colorize("Enter !tweet <message to send> to post a tweet."));
      bot.say(to, colorize("Enter !yakuman to have DumbDumbBot tell you what yakuman you should go for today."));
      bot.say(to, colorize("Enter !saki to get your spiritual Saki of the day."));
      bot.say(to, colorize("Enter !roulette <choices separated by spaces> to have DumbDumbBot randomly pick something for you."));
    }
  });
};
