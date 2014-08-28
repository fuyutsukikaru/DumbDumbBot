var gfeed = require('google-feed-api');

function salt() {
  var now = new Date();
  var saltDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCSeconds());
  return saltDate.getTime();
}

var time = salt().toString();
console.log(time);

var feed = new gfeed.Feed("http://commiesubs.com/feed" + "?t=" + time);
feed.setNumEntries(1);
  feed.listItems(function(items) {
    var data = items.title + " " + items.link;
    console.log(data);
    console.log(items);
  });
