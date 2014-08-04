var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: 'UpLGlKYtyXazTprfksMcdBoCC',
    consumerSecret: 'W1dUC3W2LoM7ifzeCqLRgBECiRHh2xCiLHX2khVGsiNfKhHiK7',
    callback: 'http://127.0.0.1:8080/auth/twitter/callback'
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
        req.session.oauth.access_token = accessToken;
        req.session.oauth.access_token_secret = accessTokenSecret;
        req.session.oauth.screen_name = results.screen_name;

        exports.token = req.session.oauth.access_token;
        exports.secret = req.session.oauth.access_token_secret;

        console.log("Logged in to Twitter");
        console.log(results);

        res.send("Authentication Successful");
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/login');
  }
}

exports.twitter = twitter;
exports.login = login;
exports.callback = callback;
