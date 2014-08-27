var gfeed = require('google-feed-api');

var feed = new gfeed.Feed("http://hikikomoridiaries.wordpress.com/feed/");
  feed.listItems(function(items) {
    var data = items[0].title + " " + items[0].link;
    console.log(data);
  });
