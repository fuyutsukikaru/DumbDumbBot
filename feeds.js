var gfeed = require('google-feed-api');

var feed = new gfeed.Feed('http://utw.me/feed/');
feed.listItems(function(items) {
  for (var i = 0; i < items.length; i++) {
    console.log(items[i].title + " " + items[i].link);
  }
})
