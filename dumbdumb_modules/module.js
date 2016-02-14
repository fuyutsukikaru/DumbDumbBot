var twitter = require('./twitter/twit.js');
var irc = require("irc");
var scrape = require('./scrape.js');
var feeds = require("./feeds.js");
var greetings = require("./greetings.js");
var regards = require("./regex.js");
var colorize = require("./utils.js").colorize(irc);

var tsundere = false;
var tsundere_list = {
  "#hapchannel": false,
  "#qd": false,
  "#tanoshimi": false,
  "#critics-conn": false,
  "#thugmoney": false
}

module.exports = function(bot) {

  bot.addListener("registered", function(message) {
    //feeds.loadfeeds(bot);
  });
  // Listeners for when people join the lobby
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
    try {
      text = text.trim();
      var space = text.indexOf(' ') < 0 ? text.length : text.indexOf(' ');
      var command = text.substring(0, space).toLowerCase();
      var rest = text.substring(space + 1).trim();

      if (tsundere_list[to] == true) {
        tsundere = true;
      } else {
        tsundere = false;
      }

      // Regex for detecting certain text patterns
      var thanksRegex = /thanks\W(\w*)$/i;
      var blessyouRegex = /bless you\W(\w*)$/i;
      var twitterurl = /\b(https|http):\/\/(www.)?twitter.com\/[\w]+\/status\/[0-9]+\b/;
      var vndburl = /\b(http|https):\/\/(www.)?vndb.org\/v[0-9]+\b/;
      var youtubeurl = /\b(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)(\w*)(&(amp;)?[\w\?=]*)?\-?\w*\b/;
      var lewd = /\b(one|1) sec\b/i;
      var inuit = /\binuit\b/i;
      var pls = /\b(ddb|dumbdumbbot) pls\b/i;

      var chanName = to.substr(to.indexOf("#") + 1);

      var dolphy = (from == "Dolphy" || from == "NotDolphy");

      var result = {
        "!hi": function() {
          bot.say(to, colorize(greetings.hello(from, tsundere)));
        },
        "!sup": function() {
          bot.say(to, colorize(greetings.hello(from, tsundere)));
        },
        "!bye": function() {
          bot.say(to, colorize(greetings.goodbye(from, tsundere)));
        },
        "!goaway": function() {
          bot.say(to, colorize(greetings.goaway(rest, tsundere)));
        },
        "!rawr": function() {
          bot.say(to, colorize(greetings.rawr(tsundere)));
        },
        "!addfeed": function() {
          if (dolphy || from == "Kasuteru" || from == "fuyutsukikaru") {
            //feeds.addfeed(chanName, rest);
          }
        },
        "!removefeed": function() {
          if (dolphy || from == "Kasuteru" || from == "fuyutsukikaru") {
            //feeds.removefeed(chanName, rest);
          }
        },
        "!listfeed": function() {
          //feeds.listfeed(chanName);
        },
        "!tsundere": function() {
          if (rest == "on") {
            tsundere_list[to] = true;
            bot.say(to, colorize("DumbDumbBot is now a tsundere!"));
          }
          else if (rest == "off") {
            tsundere_list[to] = false;
            bot.say(to, colorize("DumbDumbBot got over its tsundere phase."));
          }
        },
        "!countdown": function() {
          var strings = require("./countdown.js")(rest, tsundere);
          strings.map(function(cur, index, array) {
            bot.say(to, colorize(cur));
          });
        },
        "!yakuman": function() {
          bot.say(to, colorize(require("./shindans/mahjong.js")(from)));
        },
        "!tweet": function() {
          twitter.tweet(rest, bot, to);
        },
        "!petite": function() {
          bot.say(to, colorize(require("./petite.js")(command, from, tsundere)));
        },
        "!lolicon": function() {
          bot.say(to, colorize(require("./petite.js")(command, from, tsundere)));
        },
        "!remind": function() {
          var time = rest.substring(0, rest.indexOf(' ')).trim();
          var message = rest.substring(rest.indexOf(' ') + 1).trim();
          var values = require("./remind.js")(from, time, message);
          bot.say(to, colorize(values[1]));
          if (values[0]) {
            setTimeout(function() {
              bot.say(to, colorize(from + ": " + message));
            }, 60000 * time);
          }
        },
        "!saki": function() {
          var strings = require("./shindans/sakis.js")(from);
          strings.map(function(cur, index, array) {
            bot.say(to, colorize(cur));
          });
        },
        "!aikatsu": function() {
          var strings = require("./shindans/aikatsu.js")(from);
          strings.map(function(cur, index, array) {
            bot.say(to, colorize(cur));
          });
        },
        "!pripara": function() {
          var strings = require("./shindans/pripara.js")(from);
          strings.map(function(cur, index, array) {
            bot.say(to, colorize(cur));
          });
        },
        "!roulette": function() {
          var choices = rest.split(/[ ]+/);
          bot.say(to, colorize(require("./roulette.js")(choices, tsundere)));
        },
        "!senpai": function() {
          bot.say(to, colorize(require("./senpai.js")(tsundere)));
        },
        "!opn": function() {
          bot.say(to, colorize("Opn, you're a three year old, stop trying to act like a grown-up you big babby."));
        },
        "!search": function() {
          var source = rest.substr(0, rest.indexOf(" "));
          var query = rest.substr(rest.indexOf(" ") + 1);
          if (source.toLowerCase() == "mal") {
            require("./search.js")(source, query).then(function(text) {
              bot.say(to, colorize(text));
              bot.say(to, colorize("If this is incorrect, please try again with more specific terms."));
            }, function(text) {
              bot.say(to, colorize(text));
            });
          } else {
            bot.say(to, colorize(require("./search.js")(source, query)));
          }
        },
        "!help": function() {
          bot.say(to, colorize(require("./help.js")(rest)));
        },
      }

      var comm_result = result[command];
      if (comm_result) {
        comm_result();
      }

      if (command != "!hide" && twitterurl.test(text)) {
        // Matches a Twitter url with a tweet
        var twitterid = /status\/[0-9]+\b/;
        var statusid = twitterid.exec(text);
        var id = /[0-9]+\b/.exec(statusid[0]);
        twitter.search(id[0], bot, to);
      }
      if (youtubeurl.test(text) && command != "!hide") {
        // Matches a YouTube url
        var urls = youtubeurl.exec(text);
        require("./youtube.js")(urls).then(function(title) {
          bot.say(to, colorize(title));
        }, function(error) {
          bot.say(to, colorize(error));
        });
      }
      if (command != "!hide" && vndburl.test(text)) {
        // Detects a vndb url
        var urls = vndburl.exec(text);
        scrape.scraper(urls[0], bot, to);
      }
      if (lewd.test(text) && to != "#chromatiqa") {
        bot.say(to, colorize("one sex*"));
      }
      if (inuit.test(text)) {
        bot.say(to, colorize("INUIT TOO"));
      }
      if (pls.test(text)) {
        bot.say(to, colorize("申し訳ありません" + from + "さま"));
        bot.action(to, "feels hella bad.");
      }
      if (thanksRegex.exec(text)) {
        bot.say(to, colorize(regards.thanks(thanksRegex, text)));
      }
      if (blessyouRegex.exec(text)) {
        bot.say(to, colorize(regards.bless(blessyouRegex, text)));
      }
      if (require("./face.js")(command, rest, from, tsundere).length > 0) {
        var faces = require("./face.js")(command, rest, from, tsundere);
        faces.map(function(cur, index, array) {
          bot.say(to, colorize(cur));
        });
      }
    } catch(e) {
      console.log(e);
    }
  });
};
