var irc = require('irc');
var urlParser = require('url');
var Firebase = require('firebase');
var firebaseRef = new Firebase("https://dumbdumbbot.firebaseio.com/");
var feedparser = require('ortoo-feedparser');
var request = require('request');
var colorize = require("./utils.js").colorize(irc);

exports.feedstart = function(bot, url, receiver) {
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
        var counter = 0;
        var reqObj = {'uri': url};
        request(reqObj, function(err, resp, body) {
          if (!err) {
            feedparser.parseString(body).on('article', function(article) {
              try {
                var title = article.title;
                var data = title + " " + article.link;
                var escTitle = title.replace(/\'|\"|\.|\$|\/|\#|\[|\]/g, '_');
                oldFeeds.child(escTitle).once('value', function(snapshot) {
                  var exists = (snapshot.val() !== null);
                  if (!exists) {
                    if (counter < 5) {
                      bot.say("#" + receiver, colorize(data));
                      counter++;
                    }
                    oldFeeds.child(escTitle).set(data);
                  }
                });
              } catch (e) {
                console.error(e);
              }
            });
          }
        });
      } catch (e) {
        console.error(e);
        bot.say("#" + receiver, colorize("The feed url was not valid, try again."));
        feedRef.child(urlstring2).remove();
        return;
      }
      if (!removed) {
        setTimeout(repeat, 30000);
      }
    })();
  }
}

exports.loadfeeds = function(bot) {
  var feedRef = firebaseRef.child("feeds");
  feedRef.once('value', function(dataSnapshot) {
    dataSnapshot.forEach(function(channelSnapshot) {
      var channel = channelSnapshot.key();
      channelSnapshot.forEach(function(feedSnapshot) {
        if (!feedSnapshot.hasChild('url')) {
          var feedname = feedSnapshot.key();
          feedRef.child(channel).child(feedname).remove();
        } else {
          var feedurl = feedSnapshot.child('url').val();
          try {
            feeds.repeat(bot, feedurl, channel);
          } catch (e) {
            console.error(e);
          }
        }
      });
    });
  });
}

exports.addfeed = function(chanName, url) {
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

exports.removefeed = function(chanName, url) {
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

exports.listfeed = function(chanName) {
  var feedRef = firebaseRef.child("feeds/" + chanName);
  feedRef.once('value', function(dataSnapshot) {
    dataSnapshot.forEach(function(urlSnapshot) {
      bot.say(to, colorize(urlSnapshot.child("url").val()));
    });
  });
}
