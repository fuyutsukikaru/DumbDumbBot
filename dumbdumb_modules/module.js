var twitter = require('./twitter/twit.js');
var sakis = require('./shindans/sakis.js');
var faces = require('./face.js');
var irc = require("irc");
var scrape = require('./scrape.js');
var aikatsu = require('./shindans/aikatsu.js');
var fs = require('fs');
var feeds = require("./feeds.js");
var Firebase = require('firebase');
var youtube = require('youtube-node');
var youtubeid = require('get-youtube-id');

var firebaseRef = new Firebase("https://dumbdumbbot.firebaseio.com/");

var tsundere = false;
var tsundere_list = {
  "#bugmoney": false,
  "#hapchannel": false,
  "#qd": false,
  "#chromatiqa": false,
  "#tanoshimi": false,
  "#critics-conn": false
}

function colorize(text) {
  return irc.colors.wrap("light_magenta", text, "light_magenta");
};

function loadfeeds(bot) {
  var feedRef = firebaseRef.child("feeds");
  feedRef.once('value', function(dataSnapshot) {
    dataSnapshot.forEach(function(channelSnapshot) {
      var channel = channelSnapshot.name();
      channelSnapshot.forEach(function(feedSnapshot) {
        var feedurl = feedSnapshot.child('url').val()
        feeds.repeat(bot, feedurl, channel);
      });
    });
  });
}

module.exports = function(bot) {

  bot.addListener("registered", function(message) {
    loadfeeds(bot);
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
    text = text.trim();
    var arr = text.split(" ", 2);
    var command = arr[0].toLowerCase();
    var rest = text.substr(text.indexOf(' ') + 1);

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
    var youtubeurl = /\b(http|https):\/\/(www.)?youtube.com\/watch\?v=[\w|\W]+\b/;
    var lewd = /\b(one|1) sec\b/i;
    var inuit = /\binuit\b/i;
    var chan = /\b[\w]+\b/i;
    var pls = /\b(ddb|dumbdumbbot) pls\b/i;

    var nohash = chan.exec(to);
    var chanName = nohash[0];

    // Use the person's ID and the date to calculate a value
    var len = from.length;
    var first = from.charCodeAt(0);
    var last = from.charCodeAt(len-1);
    var d = new Date();
    var date = d.getDate();
    var day = d.getDay();
    var year = d.getFullYear();
    var month = d.getMonth();
    var val = (len + first + last) * (date + first + year) * (day + last + month) * (day + first + len) * (month + date + last);

    if (command == "!hi" || command == "!sup") {
      if (from == "DDK") {
        bot.say(to, colorize("H-Hi " + from));
      } else {
        if (tsundere) {
          bot.say(to, colorize("I-It's not like I wanted to see you or anything "
          + from));
        } else {
          bot.say(to, colorize("HI " + from.toUpperCase()));
        }
      }
    }
    if (command == "!addfeed" && (from == "Dolphy" || from == "Kasuteru" || from == "fuyutsukikaru")) {
      var feedRef = firebaseRef.child("feeds/" + chanName);
      var urlstring = rest.replace(/\./ig, ',');
      var urlstring2 = urlstring.replace(/\//ig, '__');
      console.log(urlstring2);
      feedRef.child(urlstring2).set({
        url: rest,
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
    if (command == "!removefeed" && (from == "Dolphy" || from == "Kasuteru" || from == "fuyutsukikaru")) {
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
    // Commands for detecting urls
    if (command != "!hide" && twitterurl.test(text)) {
      // Matches a Twitter url with a tweet
      console.log("Matched twitter url");
      var twitterid = /status\/[0-9]+\b/;
      var statusid = twitterid.exec(text);
      console.log(statusid[0]);
      var id = /[0-9]+\b/.exec(statusid[0]);
      console.log(id[0]);
      twitter.search(id[0], bot, to);
    }
    if (youtubeurl.test(text) && command != "!hide") {
      // Matches a YouTube url
      var urls = youtubeurl.exec(text);
      youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
      console.log("Match youtube link!");
      var id = youtubeid(urls[0]);
      console.log(id);
      youtube.getById(id, function(resultData) {
        if (!resultData.error) {
          console.log(resultData);
          bot.say(to, colorize(resultData.items[0].snippet.title));
        } else {
          console.log(resultData.error);
          bot.say(to, colorize("Could not get title."));
        }
      });
    }
    if (command != "!hide" && vndburl.test(text)) {
      // Detects a vndb url
      var urls = vndburl.exec(text);
      console.log("Match vndb link!");
      scrape.scraper(urls[0], bot, to);
    }
    // Features requested by dolphy
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
    // Thanks and Bless You detected with regex
    if (thanksRegex.exec(text)) {
      matchWord = thanksRegex.exec(text)[1].toLowerCase();
      truncatedRegex = /[aeiou].*/;
      truncatedMatch = truncatedRegex.exec(matchWord);
      thanked = "Th" + truncatedMatch
      bot.say(to, colorize(thanked));
    }
    if (blessyouRegex.exec(text)) {
      matchWord = blessyouRegex.exec(text)[1].toLowerCase();
      truncatedRegex = /[aeiou].*/;
      truncatedMatch = truncatedRegex.exec(matchWord);
      thanked = "Bl" + truncatedMatch
      bot.say(to, colorize(thanked));
    }
    // Looks of approval and disapproval
    if (command == "!loa") {
      if(text.indexOf(' ') > 0) {
        bot.say(to, colorize(rest + ": ʘ‿ʘ"));
      }
      else {
        bot.say(to, colorize("ʘ‿ʘ"));
      }
    }
    if (command == "!lod") {
      if(text.indexOf(' ') > 0) {
        bot.say(to, colorize(rest + ": ಠ_ಠ"));
      }
      else {
        bot.say(to, colorize("ಠ_ಠ"));
      }
    }
    if (command == "!rawr") {
      if (tsundere) {
        bot.say(to, colorize("Haaaaa? Are you stupid or something?"));
      } else {
        bot.say(to, colorize("Gao gao! I'm verrrryyyy scary. Fear me! Gao!"));
      }
    }
    // Enables or disables the tsundere mode
    if (command == "!tsundere") {
      if (rest == "on") {
        tsundere_list[to] = true;
        bot.say(to, colorize("DumbDumbBot is now a tsundere!"));
      }
      else if (rest == "off") {
        tsundere_list[to] = false;
        bot.say(to, colorize("DumbDumbBot got over its tsundere phase."));
      }
    }
    if (command == "!goaway") {
      if (tsundere) {
        bot.say(to, colorize("I-It's not like I want you to go or anything " + rest));
      } else {
        bot.say(to, colorize("Rawr, go away " + rest + ", I hate you!!!"));
      }
    }
    if (command == "!bye") {
      if (!tsundere) {
        bot.say(to, colorize("BYE " + from.toUpperCase()));
      } else {
        bot.say(to, colorize("G-Goodbye...baka."));
      }
    }
    // A countdown timer that goes up to 15 seconds
    if (command == "!countdown") {
      var number = rest;
      if (typeof number === 'undefined' || (isNaN(number) && number != "next tourney")) {
        bot.say(to, colorize("You need to enter a number, baka!"));
      } else if (number <= 15) {
        if (tsundere) {
          bot.say(to, colorize("W-Why do I have to do that for you? F-Fine, starting!"));
        } else {
          bot.say(to, colorize("Starting!"));
        }
        (function counter() {
          if (number > 0) {
            bot.say(to, colorize(number));
            number--;
            setTimeout(counter, 1000);
          }
          else {
            bot.say(to, colorize("GO!"));
          }
        })();
      } else if (rest == "next tourney") {
        bot.say(to, colorize("Never."));
      } else {
        bot.say(to, colorize("I'm too dumb to count from that high."));
      }
    }
    // Yakuman of the day Shindan
    if (command == "!yakuman") {
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
    // Tweet to the appropriate account
    if (command == "!tweet") {
      twitter.tweet(rest, bot, to);
    }
    if (command == "!petite") {
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
    if (command == "!lolicon") {
      bot.say(to, colorize("No just lol-"));
    }
    // A reminder function taht reminds you after a certain number of minutes
    if (command == "!remind") {
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
    // Saki shindan
    if (command == "!saki") {
      var characters = sakis.characters;
      var hash = val % characters.length;
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
    // Aikatsu shindan
    if (command == "!aikatsu") {
      var fashion = aikatsu.fashion;
      var hash = val % fashion.length;
      var brand = fashion[hash];
      bot.say(to, colorize("Today your Aikatsu brand is " + brand));
      var words = brand.split(" ", 2);
      bot.say(to, colorize("http://aikatsu.wikia.com/wiki/" + words[0] + "_" + words[1]));
    }
    // A roulette that chooses between different input options
    if (command == "!roulette") {
      var choices = rest.split(/[ ]+/);
      var options = choices.length;
      var random = Math.floor((Math.random() * options));
      if (tsundere) {
        bot.say(to, colorize("Something like " + choices[random] + " is good enough for trash like you."));
      } else {
        bot.say(to, colorize("I choose " + choices[random]));
      }
    }
    if (command == "!senpai") {
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
    // A variety of reaction faces
    if (command == "!:O") {
      var surprise = faces.surprise;
      var rows = surprise.length;
      var n;
      for (n = 0; n < rows; n++) {
        bot.say(to, colorize(surprise[n]));
      }
    }
    if (command == "!:(") {
      var sad = faces.sad;
      var rows = sad.length;
      var n;
      for (n = 0; n < rows; n++) {
        bot.say(to, colorize(sad[n]));
      }
    }
    if (command == "!XD") {
      var XD = faces.XD;
      var rows = XD.length;
      var n;
      for (n = 0; n < rows; n++) {
        bot.say(to, colorize(XD[n]));
      }
    }
    if (command == "!>_<") {
      var cutie = faces.cutie;
      var rows = cutie.length;
      var n;
      for (n = 0; n < rows; n++) {
        bot.say(to, colorize(cutie[n]));
      }
    }
    if (command == "!:)") {
      if (from == "DDK")
        bot.say(to, colorize(";)"));
      else {
        if (tsundere)
          bot.say(to, colorize("I-It's not like I'm saving that smile for somebody or anything!!!"));
        else
          bot.say(to, colorize("I want to protect that smile for the one I truly love."));
      }
    }
    if (command == "!:9") {
      var nine = faces.nine;
      var rows = nine.length;
      var n;
      for (n = 0; n < rows; n++) {
        bot.say(to, colorize(nine[n]));
      }
    }
    if (command == "!mibucchi" | command == "!meball") {
      var mibucchi = faces.mibucchi;
      var rows = mibucchi.length;
      var n;
      for (n = 0; n < rows; n++) {
        bot.say(to, colorize(mibucchi[n]));
      }
    }
    if (command == "!help") {
      bot.say(to, colorize("Enter !hi or !sup to have DumbDumbBot greet you!"));
      bot.say(to, colorize("Enter !bye to have DumbDumbBot see you off!"));
      bot.say(to, colorize("Enter !goaway <name of person> to have DumbDumbBot be rude to a person."));
      bot.say(to, colorize("Enter !countdown <number> to have DumbDumbBot start a countdown! Limited to numbers under 15."));
      bot.say(to, colorize("Enter !remind <minutes> <message> to have DumbDumbBot remind you of things."));
      bot.say(to, colorize("Enter !tweet <message to send> to post a tweet."));
      bot.say(to, colorize("Use the !hide command to prevent DumbDumbBot from posting the titles of YouTube videos and VNs."));
      bot.say(to, colorize("Enter !yakuman to have DumbDumbBot tell you what yakuman you should go for today."));
      bot.say(to, colorize("Enter !saki to get your spiritual Saki of the day."));
      bot.say(to, colorize("Enter !roulette <choices separated by spaces> to have DumbDumbBot randomly pick something for you."));
      bot.say(to, colorize("Enter !senpai to ask DumbDumbBot if senpai has noticed you."));
      bot.say(to, colorize("Enter !:O, !:(, !XD, !>_< to have DumbDumbBot express its emotions."));
    }
  });
};
