var gfeed = require('google-feed-api');

function salt() {
  var now = new Date();
  var saltDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return saltDate.getTime();
}

var time = salt().toString();
console.log(time);

var feed = new gfeed.Feed("http://hikikomoridiaries.wordpress.com/feed/" + "?t=" + time);
  feed.listItems(function(items) {
    var data = items[0].title + " " + items[0].link;
    console.log(data);
    console.log(items);
  });
