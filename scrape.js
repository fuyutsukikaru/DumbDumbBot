var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var irc = require('irc');

function colorize(text) {
  return irc.colors.wrap("light_magenta", text, "light_magenta");
};

function scraper(url, bot, receiver) {
  console.log("Starting scrape!");
  console.log(url);
  request(url, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      var data;
      data = $('table.stripe').children('tr').children('td').eq(1).text();
      console.log(data);
      if (data == "")
        bot.say(receiver, colorize("Could not find a VN at url."));
      else
        bot.say(receiver, colorize(data));
    } else {
      console.log(error);
    }
  })
}

exports.scraper = scraper;
