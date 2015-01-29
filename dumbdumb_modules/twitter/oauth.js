var OAuth = require('oauth').OAuth;
var oa = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  "UpLGlKYtyXazTprfksMcdBoCC",
  "W1dUC3W2LoM7ifzeCqLRgBECiRHh2xCiLHX2khVGsiNfKhHiK7",
  "1.0",
  "http://127.0.0.1:8080/auth/twitter/callback",
  "HMAC-SHA1"
);

function login(req, res) {
  console.log("login called..");
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
    if (error) {
      console.log(error);
      res.send("Error returned: "+error);

    } else {
      req.session.oauth = {};
      req.session.oauth.token = oauth_token;
      req.session.oauth.token_secret = oauth_token_secret;
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token);
    }
  });
}

function callback(req, res) {
  if (req.session.oauth !== undefined) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth = req.session.oauth;

    oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier, function(error, oauth_access_token, oauth_access_token_secret, results){
      if (error) {
        console.log("Error: Twitter login failed: ", error);
        res.end("Error occured with callback: "+ error);
      } else {
        req.session.oauth.access_token = oauth_access_token;
        req.session.oauth.access_token_secret = oauth_access_token_secret;
        req.session.oauth.screen_name = results.screen_name;

        console.log("Logged in to Twitter");
        console.log(results);

        var output = '<html><head></head><body onload="window.close();">Close this window</body></html>';
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(output);
      }
    });
  } else {
    res.redirect('/');
  }
}

exports.login = login;
exports.callback = callback;
