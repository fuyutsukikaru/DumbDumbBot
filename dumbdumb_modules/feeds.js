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
  var oldFeeds = feedRef.child(urlstring2).child("old");
  if (url != "") {
    feedRef.once('child_removed', function(oldChildSnapshot) {
      if (oldChildSnapshot.child('url').val() == url) {
        removed = true;
      }
    });
    (function repeat() {
      var time = salt().toString();
      var feed = new gfeed.Feed(url + "?bypass_cache=" + Date.now() / 30000);
      feed.setNumEntries(1);
      feed.listItems(function(items) {
        if (!items.error && (typeof items !== 'undefined')) {
          var title = items[0].title;
          var data = title + " " + items[0].link;
          oldFeeds.child(title).once('value', function (snapshot) {
            var exists = (snapshot.val() !== null);
            if (!exists) {
              if (!initial) {
                bot.say("#" + receiver, colorize(data));
              }
              oldFeeds.child(title).set(data);
              initial = false;
            }
          });
        }
        if (!removed) {
          setTimeout(repeat, 30000);
        }
      });
    })();
  }
}

exports.repeat = feedstart;
