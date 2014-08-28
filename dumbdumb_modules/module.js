var twitter = require('../twit.js');
var sakis = require('../sakis.js');
var faces = require('../face.js');
var irc = require("irc");
var scrape = require('../scrape.js');
var aikatsu = require('../aikatsu.js');
var fs = require('fs');
var feeds = require("../feeds");
var Firebase = require('firebase');
var firebaseRef = new Firebase("https://dumbdumbbot.firebaseio.com/");

var tsundere = false;

function colorize(text) {
  return irc.colors.wrap("light_magenta", text, "light_magenta");
};

function loadfeeds(bot) {
  var feedRef = firebaseRef.child("feeds");
  feedRef.once('value', function(dataSnapshot) {
    dataSnapshot.forEach(function(channelSnapshot) {
      var channel = channelSnapshot.name();
      console.log(channel);
      channelSnapshot.forEach(function(feedSnapshot) {
        var feedurl = feedSnapshot.child('url').val()
        console.log(feedurl);
        feeds.repeat(bot, feedurl, channel);
      });
    });
  });
}

module.exports = function(bot) {

  bot.addListener("registered", function(message) {
    loadfeeds(bot);
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
    text = text.trim();
    var arr = text.split(" ", 2);
    var command = arr[0];
    var rest = text.substr(text.indexOf(' ') + 1);

    var thanksRegex = /thanks\W(\w*)$/i;
    var blessyouRegex = /bless you\W(\w*)$/i;
    var twitterurl = /\b(https|http):\/\/(www.)?twitter.com\/[\w]+\/status\/[0-9]+\b/;
    var vndburl = /\b(http|https):\/\/(www.)?vndb.org\/v[0-9]+\b/;
    var lewd = /\bone sec\b/i;
    var inuit = /\binuit\b/i;
    var chan = /\b[\w]+\b/i;

    var nohash = chan.exec(to);
    var chanName = nohash[0];

    var len = from.length;
    var first = from.charCodeAt(0);
    var last = from.charCodeAt(len-1);
    var d = new Date();
    var date = d.getDate();
    var day = d.getDay();
    var year = d.getFullYear();
    var month = d.getMonth();
    var val = (len + first + last) * (date + first) * (day + last) * (year + day + first) * (month + date + last);
    
    if (command == "!hi" || command == "!sup") {
      if (from == "DDK") {
        bot.say(to, colorize("H-Hi " + from));
      } else {
        if (tsundere)
          bot.say(to, colorize("I-It's not like I wanted to see you or anything "
          + from));
        else
          bot.say(to, colorize("HI " + from.toUpperCase()));
      }
    }
    else if (command == "!addfeed" && (from == "Dolphy" || from == "Kasuteru" || from == "fuyutsukikaru")) {
      var feedRef = firebaseRef.child("feeds/" + chanName);
      var urlstring = rest.replace(/\./ig, ',');
      var urlstring2 = urlstring.replace(/\//ig, '__');
      console.log(urlstring2);
      feedRef.child(urlstring2).set({
        url: rest
      }, function(error) {
        if (error) {
          bot.say(to, colorize("Could not add feed."));
          console.log(error);
        } else {
          bot.say(to, colorize("Feed added!"));
          feeds.repeat(bot, rest, chanName);
        }
      });
    }
    else if (command == "!removefeed" && (from == "Dolphy" || from == "Kasuteru" || from == "fuyutsukikaru")) {
      var feedRef = firebaseRef.child("feeds/" + chanName);
      var urlstring = rest.replace(/\./ig, ',');
      var urlstring2 = urlstring.replace(/\//ig, '__');
      feedRef.child(urlstring2).remove(function(error) {
        if (error) {
          bot.say(to, colorize("Could not remove feed."));
          console.log(error);
        } else {
          bot.say(to, colorize("Feed removed"));
        }
      });
    }
    else if (twitterurl.test(text)) {
      console.log("Matched twitter url");
      var twitterid = /status\/[0-9]+\b/;
      var statusid = twitterid.exec(text);
      console.log(statusid[0]);
      var id = /[0-9]+\b/.exec(statusid[0]);
      console.log(id[0]);
      twitter.search(id[0], bot, to);
    }
    else if (lewd.test(text) && to != "#chromatiqa") {
      bot.say(to, colorize("one sex*"));
    }
    else if (inuit.test(text)) {
      bot.say(to, colorize("INUIT TOO"));
    }
    else if (vndburl.test(text)) {
      var urls = vndburl.exec(text);
      console.log("Match vndb link!");
      scrape.scraper(urls[0], bot, to);
    }
    else if (thanksRegex.exec(text)) {
      matchWord = thanksRegex.exec(text)[1].toLowerCase();
      truncatedRegex = /[aeiou].*/;
      truncatedMatch = truncatedRegex.exec(matchWord);
      thanked = "Th" + truncatedMatch
      bot.say(to, colorize(thanked));
    }
    else if (blessyouRegex.exec(text)) {
      matchWord = blessyouRegex.exec(text)[1].toLowerCase();
      truncatedRegex = /[aeiou].*/;
      truncatedMatch = truncatedRegex.exec(matchWord);
      thanked = "Bl" + truncatedMatch
      bot.say(to, colorize(thanked));
    }
    else if (command == "!loa") {
      if(text.indexOf(' ') > 0) {
        bot.say(to, colorize(rest + ": ʘ‿ʘ"));
      }
      else {
        bot.say(to, colorize("ʘ‿ʘ"));
      }
    }
    else if (command == "!lod") {
      if(text.indexOf(' ') > 0) {
        bot.say(to, colorize(rest + ": ಠ_ಠ"));
      }
      else {
        bot.say(to, colorize("ಠ_ಠ"));
      }
    }
    else if (command == "!tsundere") {
      if (rest == "on") {
        tsundere = true;
        bot.say(to, colorize("DumbDumbBot is now a tsundere!"));
      }
      else if (rest == "off") {
        tsundere = false;
        bot.say(to, colorize("DumbDumbBot got over its tsundere phase."));
      }
    }
    else if (command == "!goaway") {
      if (tsundere)
        bot.say(to, colorize("I-It's not like I want you to go or anything " + rest));
      else
        bot.say(to, colorize("Go away " + rest));
    }
    else if (command == "!bye") {
      bot.say(to, colorize("BYE " + from.toUpperCase()));
    }
    else if (command == "!countdown") {
      var number = rest;
      if (number <= 15) {
        if (tsundere)
          bot.say(to, colorize("W-Why do I have to do that for you? F-Fine, starting!"));
        else
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
      } else if (rest == "next tourney")
        bot.say(to, colorize("Never."));
      else
        bot.say(to, colorize("I'm too dumb to count from that high."));
    }
    else if (command == "!yakuman") {
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
      else if (from == "Piroko" || from == "kafushino") {
        bot.say(to, colorize("This is the FBI. Please take a seat."));
      }
      else if (from == "LoliSenpai" || from == "Restinya") {
        bot.say(to, colorize("I'm a lolicon! XD"));
      } else {
        if (tsundere)
          bot.say(to, colorize("I-It's not like I like lolis or anything, stupid, I just like them petite!"));
        else
          bot.say(to, colorize("I'm not a lolicon, I just like petite girls!"));
      }
    }
    else if (command == "!lolicon") {
      bot.say(to, colorize("No just lol-"));
    }
    else if (command == "!remind") {
      var time = arr[1];
      var len = time.length;
      if (time == parseInt(time)) {
        var reminder = text.substr(text.indexOf(' ') + len + 2);
        bot.say(to, colorize("Reminder set for " + from));
        setTimeout(function() { bot.say(to, colorize(from + ": " + reminder)); }, 60000 * time);
      } else {
        bot.say(to, colorize("Need to set a valid number of minutes!"));
      }
    }
    else if (command == "!saki") {
      var characters = sakis.characters;
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
          saki = characters[3];
      }
      if (saki == "Maho Yumeno" || saki == "Kaori Senoo") {
        bot.say(to, colorize("Your spirit Saki today is the worst Saki, " + saki));
      } else {
        bot.say(to, colorize("Your spirit Saki today is " + saki));
      }
      var chars = saki.split(" ", 2);
      if (!chars[1]) {
        bot.say(to, colorize("http://saki.wikia.com/wiki/" + chars[0]));
      } else {
        bot.say(to, colorize("http://saki.wikia.com/wiki/" + chars[0] + "_" + chars[1]));
      }
    }
    else if (command == "!aikatsu") {
      var fashion = aikatsu.fashion;
      var hash = val % 13;
      var brand = fashion[hash];
      bot.say(to, colorize("Today your Aikatsu brand is " + brand));
      var words = brand.split(" ", 2);
      bot.say(to, colorize("http://aikatsu.wikia.com/wiki/" + words[0] + "_" + words[1]));
    }
    else if (command == "!roulette") {
      var choices = rest.split(" ");
      var options = choices.length;
      var random = Math.floor((Math.random() * options));
      bot.say(to, colorize("I choose " + choices[random]));
    }
    else if (command == "!senpai") {
      var random = Math.floor((Math.random() * 10));
      if (random == 0) {
        if (tsundere)
          bot.say(to, colorize("B-Baka! S-Senpai noticed you..."));
        else
          bot.say(to, colorize("Senpai noticed you!"));
      }
      else {
        if (tsundere)
          bot.say(to, colorize("H-Hmph! S-So what if senpai didn't notice you?"));
        else
          bot.say(to, colorize("Senpai will never notice you..."));
      }
    }
    else if (command == "!:O") {
      var surprise = faces.surprise;
      var rows = surprise.length;
      var n;
      for (n = 0; n < rows; n++) {
        bot.say(to, colorize(surprise[n]));
      }
    }
    else if (command == "!:(") {
      var sad = faces.sad;
      var rows = sad.length;
      var n;
      for (n = 0; n < rows; n++) {
        bot.say(to, colorize(sad[n]));
      }
    }
    else if (command == "!XD") {
      var XD = faces.XD;
      var rows = XD.length;
      var n;
      for (n = 0; n < rows; n++) {
        bot.say(to, colorize(XD[n]));
      }
    }
    else if (command == "!>_<") {
      var cutie = faces.cutie;
      var rows = cutie.length;
      var n;
      for (n = 0; n < rows; n++) {
        bot.say(to, colorize(cutie[n]));
      }
    }
    else if (command == "!:)") {
      if (from == "DDK")
        bot.say(to, colorize(";)"));
      else {
        if (tsundere)
          bot.say(to, colorize("I-It's not like I'm saving that smile for somebody or anything!!!"));
        else
          bot.say(to, colorize("I want to protect that smile for the one I truly love."));
      }
    }
    else if (command == "!help") {
      bot.say(to, colorize("Enter !hi or !sup to have DumbDumbBot greet you!"));
      bot.say(to, colorize("Enter !bye to have DumbDumbBot see you off!"));
      bot.say(to, colorize("Enter !goaway <name of person> to have DumbDumbBot be rude to a person."));
      bot.say(to, colorize("Enter !countdown <number> to have DumbDumbBot start a countdown! Limited to numbers under 15."));
      bot.say(to, colorize("Enter !remind <minutes> <message> to have DumbDumbBot remind you of things."));
      bot.say(to, colorize("Enter !tweet <message to send> to post a tweet."));
      bot.say(to, colorize("Enter !yakuman to have DumbDumbBot tell you what yakuman you should go for today."));
      bot.say(to, colorize("Enter !saki to get your spiritual Saki of the day."));
      bot.say(to, colorize("Enter !roulette <choices separated by spaces> to have DumbDumbBot randomly pick something for you."));
      bot.say(to, colorize("Enter !senpai to ask DumbDumbBot if senpai has noticed you."));
      bot.say(to, colorize("Enter !:O, !:(, !XD, !>_< to have DumbDumbBot express its emotions."));
    }
  });
};
