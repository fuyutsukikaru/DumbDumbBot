var pripara = [
  "Silky Heart",
  "Twinkle Ribbon",
  "Holic Trick",
  "Dreaming Girl",
  "Coord Master List",
  "Marionette Mu",
  "Baby Monster",
  "Candy Alamode",
  "Fortune Party",
  "Prism Stone",
  "Pretty Rhythm",
];

module.exports = function(from) {
  var hash = require("../hash.js")(from) % pripara.length;
  var brand = pripara[hash];
  var returns = [];
  returns.push("Today your Pripara brand is " + brand);
  var words = brand.split(" ", 2);
  returns.push("http://pripara.wikia.com/wiki/" + words[0] + "_" + words[1]);
  return returns;
}
