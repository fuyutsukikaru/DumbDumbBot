var twit = require('twit');
var irc = require('irc');

var twitter = new twit({
  consumer_key: 'tpNGGaBKwUA3Mys2XJr6g6rzO',
  consumer_secret: 'aZdycgA2oYkGOEIWcve9ADypgN4sEIICsOufHw9cws5qLXFbnC',
  access_token: '1687430976-yxuGeSQzd9xVh5RijFn0Yi85aLHG67XNwJV9mum',
  access_token_secret: 'D6dlbNsFmanFlpw7oZmYanO9zuZky5nn4aFBiaCj4xC4u'
});

function colorize(text) {
  return irc.colors.wrap("light_magenta", text, "light_magenta");
};

function tweet(message, bot, receiver) {
  var len = message.length;

  twitter.post("statuses/update", {
    status: message
  },
  function(err, data, response) {
    if (err) {
      // something went wrong
      console.log("Something happened here");
      console.log(data);
      console.log(err);
      if (len > 140) {
        bot.say(receiver, colorize("Tweet failed to send, over 140 characters."));
      }
      else {
        bot.say(receiver, colorize("Tweet failed to send, try again."));
      }
    } else {
      // data contains the data sent by twitter
      console.log("Sent successfully!");
      bot.say(receiver, colorize("\"" + message + "\" was sent successfully!"));
    }
  }
  );
}

function search(num, bot, receiver) {
  twitter.get('statuses/show/:id', { id: num }, function(err, data, response) {
      if (!err) {
        var result = data.user.screen_name + "-sama tweeted: " + data.text;
        bot.say(receiver, colorize(result));
      } else {
        bot.say(receiver, colorize("Could not retrieve tweet."));
      }
  })
}

exports.twitter = twitter;
exports.tweet = tweet;
exports.search = search;
