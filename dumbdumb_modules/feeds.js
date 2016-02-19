var urlParser = require('url');
var Firebase = require('firebase');
var firebaseRef = new Firebase("https://dumbdumbbot-test.firebaseio.com/");
var feedparser = require('ortoo-feedparser');
var request = require('request');
var Promise = require('promise');
var parse = require('xml2js').parseString;

function start(url, receiver) {
  if (url.length > 0) {
    var feedRef = firebaseRef.child("feeds/" + receiver);
    var urlstring = url.split(".").join(",").split("/").join('__');
    var oldRef = feedRef.child(urlstring).child("old");
    return new Promise(function(fulfill, reject) {
      feedRef.once('child_removed', function(oldChildSnapshot) {
        reject("removed");
      });
      request.get(url, function(err, resp, body) {
        if (!err) {
          callback(body, function(error, result) {
            if (!error) {
              var item = result.rss.channel[0].item[0];
              var post = item.title[0] + " " + item.link[0];
              var escTitle = item.title[0].replace(/\'|\"|\.|\$|\/|\#|\[|\]/g, '_');
              oldRef.child(escTitle).once('value', function(snapshot) {
                if (snapshot.val() !== null) {
                  oldRef.child(escTitle).set(post);
                  fulfill(post);
                }
              });
            } else {
              console.log(error);
            }
          });
        } else {
          console.log(err);
        }
      });
    });
  }
}

/*exports.feedstart = function(bot, url, receiver) {
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
                      //bot.say("#" + receiver, colorize(data));
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
        //bot.say("#" + receiver, colorize("The feed url was not valid, try again."));
        feedRef.child(urlstring2).remove();
        return;
      }
      if (!removed) {
        setTimeout(repeat, 30000);
      }
    })();
  }
}*/

exports.loadfeeds = function() {
  firebaseRef.child("feeds").once('value', function(dataSnapshot) {
    dataSnapshot.forEach(function(channelSnapshot) {
      var channel = channelSnapshot.key();
      channelSnapshot.forEach(function(feedSnapshot) {
        if (!feedSnapshot.hasChild('url')) {
          feedSnapshot.remove();
        } else {
          var feedurl = feedSnapshot.child('url').val();
          start(feedurl, channel).then(function(text) {
            console.log(text);
          }, function(text) {
            console.log(text);
          });
        }
      });
    });
  });
}

exports.addfeed = function(chanName, url) {
  var feedRef = firebaseRef.child("feeds/" + chanName);
  var urlstring = url.split(".").join(',').split("/").join('__');
  return new Promise(function(fulfill, reject) {
    feedRef.child(urlstring).set({
      url: url,
    }, function(error) {
      if (error) {
        reject("Could not add feed.");
        console.log(error);
      } else {
        fulfill("Feed added!");
        start(url, chanName).then(function(text) {
          fulfill(text);
        }, function(text) {
          reject(text);
        });
      }
    });
  });
}

exports.removefeed = function(chanName, url) {
  var feedRef = firebaseRef.child("feeds/" + chanName);
  var urlstring = url.split(".").join(",").split("/").join('__');
  return new Promise(function(fulfill, reject) {
    feedRef.child(urlstring).remove(function(error) {
      if (error) {
        reject("Could not remove feed.");
        console.log(error);
      } else {
        fulfill("Feed removed");
      }
    });
  });
}

exports.listfeed = function(chanName) {
  var feedRef = firebaseRef.child("feeds/" + chanName);
  return new Promise(function(fulfill, reject) {
    feedRef.once('value', function(dataSnapshot) {
      fulfill(dataSnapshot);
    });
  });
}
