var gfeed = require('google-feed-api');
var irc = require('irc');
var Firebase = require('firebase');
var firebaseRef = new Firebase("https://dumbdumbbot.firebaseio.com/");

function colorize(text) {
  return irc.colors.wrap("light_magenta", text, "light_magenta");
};

function salt() {
  var now = new Date();
  var saltDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDay());
  return saltDate.getTime();
}

function feedstart(bot, url, receiver) {
  var feedRef = firebaseRef.child("feeds/" + receiver);
  var urlstring = url.replace(/\./ig, ',');
  var urlstring2 = urlstring.replace(/\//ig, '__');
  var initial = true;
  var removed = false;
  if (url != "") {
    feedRef.once('child_removed', function(oldChildSnapshot) {
      //console.log(oldChildSnapshot.child('url').val());
      if (oldChildSnapshot.child('url').val() == url) {
        removed = true;
        console.log("Feed removed.");
      }
    });
    (function repeat() {
      var time = salt().toString();
      var feed = new gfeed.Feed(url + "?t=" + time);
      var last;
      feedRef.once('value', function(dataSnapshot) {
        last = dataSnapshot.child(urlstring2).child('last').val();
        feed.setNumEntries(1);
        feed.listItems(function(items) {
          if (!items.error && (typeof items !== 'undefined')) {
            var data = items[0].title + " " + items[0].link;
            if (data != last) {
              console.log(data);
              if (!initial) {
                bot.say("#" + receiver, colorize(data));
              }
              //last = data;
              feedRef.child(urlstring2).child('last').set(data);
              initial = false;
            } else {
              //console.log(data);
              //console.log("Nothing new on " + url);
              //bot.say("#" + receiver, "Nothing new on " + url);
            }
          } else {
            console.log(items.error);
            console.log("Error on " + receiver + " " + url);
          }
          if (!removed)
            setTimeout(repeat, 30000);
          else
            console.log("Feed was removed.");
        });
      });
    })();
  }
}

exports.repeat = feedstart;