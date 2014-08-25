var twit = require('twit');

var twitter = new twit({
  consumer_key: 'wnKx96qCPTMYQI5W5WKRoDjFM',
  consumer_secret: '7e1kOTPFeLfF52L0Y8iEwvuZyxGUkB6ThNMR21ZZPUqQXGAL3h',
  access_token: '1687430976-wJEuj3Ly9BuvkZuAfjFHC3xo88bymVtm2CQGBZw',
  access_token_secret: 'OeBPBtv8iFZK8TkBqnCxEMq0LsQyTbTzSKhccEadR3rQb'
});

function tweet(message, bot, receiver) {
  var len = message.length;

  twitter.post("statuses/update", {
    status: message
  },
  function(error, data, response) {
    if (error) {
      // something went wrong
      console.log("Something happened here");
      if (len > 140) {
        bot.say(receiver, "Tweet failed to send, over 140 characters.");
      }
      else {
        bot.say(receiver, "Tweet failed to send, try again.");
      }
    } else {
      // data contains the data sent by twitter
      console.log("Sent successfully!");
      bot.say(receiver, "\"" + message + "\" was sent successfully!");
    }
  }
  );
}

exports.twitter = twitter;
