var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: 'UpLGlKYtyXazTprfksMcdBoCC',
    consumerSecret: 'W1dUC3W2LoM7ifzeCqLRgBECiRHh2xCiLHX2khVGsiNfKhHiK7',
    //callback: 'http://127.0.0.1:5000/callback'
    callback: 'http://aqueous-ridge-7838.herokuapp.com/callback'
});

function login(req, res) {
  twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
    if (error) {
      console.log(error);
      res.send("Error returned: " + error);
    } else {
      console.log("Got here");
      req.session.oauth = {};
      req.session.oauth.token = requestToken;
      req.session.oauth.token_secret = requestTokenSecret;
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + requestToken);
    }
  });
}

var token;
var secret;

function callback(req, res) {
  if (req.session.oauth !== undefined) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth = req.session.oauth;

    twitter.getAccessToken(oauth.token, oauth.token_secret, oauth.verifier, function(error, accessToken, accessTokenSecret, results){
      if (error) {
        console.log("Error: Twitter login failed: ", error);
        res.end("Error occured with callback: "+ error);
      } else {
        console.log("Got even here");
        token = accessToken;
        secret = accessTokenSecret;
        req.session.oauth.access_token = accessToken;
        req.session.oauth.access_token_secret = accessTokenSecret;
        req.session.oauth.screen_name = results.screen_name;

        console.log("Logged in to Twitter");
        console.log(results);
      }
    });
  } else {
    res.redirect('/login');
  }
}

function tweet(message) {
  twitter.statuses("update", {
    status: message
  },
  token,
  secret,
  function(error, data, response) {
    if (error) {
      // something went wrong
      console.log("Something happened here");
    } else {
      // data contains the data sent by twitter
      console.log("Sent successfully!");
    }
  }
  );
}

exports.tweet = tweet;
exports.login = login;
exports.callback = callback;
