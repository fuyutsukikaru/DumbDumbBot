var irc = require('irc');
var urlParser = require('url');
var Firebase = require('firebase');
var firebaseRef = new Firebase("https://dumbdumbbot.firebaseio.com/");
var feedparser = require('ortoo-feedparser');

function colorize(text) {
  return irc.colors.wrap("light_magenta", text, "light_magenta");
};

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
      try {
        feedparser.parseUrl(url).on('article', function(article) {
          try {
            var title = article.title;
            var data = title + " " + article.link;
            var escTitle = title.replace(/\'|\"|\.|\$|\/|\#|\[|\]/g, '_');
            oldFeeds.child(escTitle).once('value', function(snapshot) {
              var exists = (snapshot.val() !== null);
              if (!exists) {
                bot.say("#" + receiver, colorize(data));
                oldFeeds.child(escTitle).set(data);
              }
            });
          } catch (e) {
            console.error(e);
          }
        });
      } catch (e) {
        console.error(e);
        feedRef.child(urlstring2).remove();
      }
      if (!removed) {
        setTimeout(repeat, 30000);
      }
    })();
  }
}

exports.repeat = feedstart;
