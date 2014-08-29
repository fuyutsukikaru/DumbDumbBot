var gfeed = require('google-feed-api');

function salt() {
  var now = new Date();
  var saltDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDay());
  return saltDate.getTime();
}

var time = salt().toString();
console.log(time);

var feed = new gfeed.Feed("http://www.mezashite.net/feed/" + "?t=" + time);
feed.setNumEntries(1);
  feed.listItems(function(items) {
    var data = items[0].title + " " + items[0].link;
    console.log(data);
    console.log(items);
  });
  /*feed.load(function(result) {
    //var data = result.feed.entries[0].title + " " + result.feed.entries[0].link;
    console.log(result.feed.entries[0]);
    //console.log(data);
  });*/
