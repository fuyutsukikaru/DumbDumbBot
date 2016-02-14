var fashion = [
  "Angely Sugar",
  "Vivid Kiss",
  "Dreamy Crown",
  "Swing Rock",
  "Futuring Girl",
  "LoLi GoThiC",
  "Happy Rainbow",
  "Spicy Ageha",
  "Love Moonrise",
  "Magical Toy",
  "Bohemian Sky",
  "Aurora Fantasy",
  "Love Queen",
  "Sangria Rosa",
  "Sakurairo Kaden",
  "Dance Fusion",
  "Retro Clover",
  "Dolly Devil"
];

module.exports = function(from) {
  var hash = require("../hash.js")(from) % fashion.length;
  var brand = fashion[hash];
  var returns = [];
  returns.push("Today your Aikatsu brand is " + brand);
  var words = brand.split(" ", 2);
  returns.push("http://aikatsu.wikia.com/wiki/" + words[0] + "_" + words[1]);
  return returns;
}
