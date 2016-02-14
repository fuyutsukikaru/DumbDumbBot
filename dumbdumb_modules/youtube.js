var YouTube = require('youtube-node');
var youtubeid = require('get-youtube-id');
var Promise = require('promise');

module.exports = function(urls) {
  var youtube = new YouTube();
  youtube.setKey('AIzaSyB3zgUs5u4hXdf6UgUZRalu70WdwaSWgJ4');
  var id = youtubeid(urls[0]);
  return new Promise(function(fulfill, reject) {
    youtube.getById(id, function(error, result) {
      if (!error && result.items.length > 0) {
        fulfill(result.items[0].snippet.title);
      } else {
        reject("Could not get title.");
      }
    });
  });
}
