var yakuman = [
"Kokushi Musou",
  "Daisangen",
  "Shousuushii",
  "Daisuushi",
  "Chuurenpoutou",
  "Suu Ankou",
  "Ryuuiisou",
  "Suu Kantsu",
  "Tsuuiisou",
  "Chinroutou",
  "Tenhou",
  "Chiihou",
  "Renhou"
  ];

module.exports = function(from) {
  var hash = require("../hash.js")(from) % 13;
  if (from == "Restinya" || from == "LoliSenpai") {
    return "Today you should try going for pinfu so you can finally learn what it is.";
  } else {
    return "Today you should try going for " + yakuman[hash];
  }
}
