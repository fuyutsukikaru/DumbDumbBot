var twit = require('twit');
var irc = require('irc');

var twitter = new twit({
  consumer_key: 'tpNGGaBKwUA3Mys2XJr6g6rzO',
  consumer_secret: 'aZdycgA2oYkGOEIWcve9ADypgN4sEIICsOufHw9cws5qLXFbnC',
  access_token: '1687430976-yxuGeSQzd9xVh5RijFn0Yi85aLHG67XNwJV9mum',
  access_token_secret: 'D6dlbNsFmanFlpw7oZmYanO9zuZky5nn4aFBiaCj4xC4u'
});

var twitter2 = new twit({
  consumer_key: 'EfnyxsZDM4sRsPqz7NEe4Nl3l',
  consumer_secret: 'ybIVkwktyOFMZTgRokRSmEHs2cw1sChbwFJvJWRIYJ0TZ7FEdQ',
  access_token: '2777981995-z4dP9RhyHZ5ibDEhZ9zKJHN3DnWCel7ZU83iVAT',
  access_token_secret: 'yZVQ5afcdu1LhoT6ATtmOTzNwGKchTCzDppDQZaOMLEUk'
});

function colorize(text) {
  return irc.colors.wrap("light_magenta", text, "light_magenta");
};

function tweet(message, bot, receiver) {
  var len = message.length;

  if (receiver == "#bugmoney" || receiver == "#hapchannel" || receiver == "#qd") {
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
  } else if (receiver == "#tanoshimi") {
    twitter2.post("statuses/update", {
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
  } else {
    bot.say(receiver, colorize("Your channel doesn't have a Twitter!"));
  }
}

function search(num, bot, receiver) {
  twitter.get('statuses/show/:id', { id: num, include_entities: true }, function(err, data, response) {
      if (!err) {
        var tweet = data.text;
        var len = data.entities.urls.length;
        //console.log(len);
        for (var i = 0; i < len; i++) {
          //console.log(data.entities.urls[0].url);
          //console.log(data.entities.urls[0].expanded_url);
          tweet = tweet.replace(data.entities.urls[i].url, data.entities.urls[0].display_url);
        }
        var result = data.user.screen_name + "-sama tweeted: " + tweet;
        bot.say(receiver, colorize(result));
      } else {
        bot.say(receiver, colorize("Could not retrieve tweet."));
      }
  })
}

exports.twitter = twitter;
exports.tweet = tweet;
exports.search = search;
