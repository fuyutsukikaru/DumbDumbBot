var YouTube = require('youtube-node');
var youtubeid = require('get-youtube-id');

var youtube = new YouTube();

var youtubeurl = /\b(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)(\w*)(&(amp;)?[\w\?=]*)?\-?\w*\b/;

var text = "Testing a https://www.youtube.com/watch?v=vOHKqf-LFsE link"
var urls = youtubeurl.exec(text);
console.log(urls);
youtube.setKey('AIzaSyB3zgUs5u4hXdf6UgUZRalu70WdwaSWgJ4');
var id = youtubeid(urls[0]);
console.log(id);
youtube.getById(id, function(error, result) {
  if (!error) {
    console.log(result.items[0].snippet.title);
  } else {
    console.log(error);
  }
});
