var request = require('request');
var parse = require('xml2js').parseString;
var Promise = require('promise');

module.exports = function(source, query) {
  if (!source || !query) {
    return "Not a valid source or query!";
  } else if (source.toLowerCase() == "google") {
    var query = query.split(' ').join('+');
    return "Here are your search results from Google! https://www.google.com/?#q=" + query;
  } else if (source.toLowerCase() == "mal") {
    var query = query.split(' ').join('+');
    var url = "http://fuyutsukikaru:superflame@myanimelist.net/api/anime/search.xml?q=" + query;
    return malSearch(url, parse);
  }
}

function malSearch(url, callback) {
  return new Promise(function(fulfill, reject) {
    request.get(url, function(err, response, body) {
      callback(body, function(err, result) {
        if (!err && result != null && result.anime.entry.length > 0) {
          var id = result.anime.entry[0].id[0];
          var title = result.anime.entry[0].title[0];
          var n_title = title.split(' ').join('_');
          var url = "http://myanimelist.net/anime/" + id + "/" + n_title;
          fulfill(title + " " + url);
        } else {
          reject("Could not find the series.");
        }
      });
    });
  });
}
