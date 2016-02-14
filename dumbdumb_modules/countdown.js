var go = [
  "GO!",
  "GO!!!",
  "Go?",
  "Go~",
  "Go......",
  "Go :)",
  "Go fish",
  "五",
  "GOOOOOOOOOOOO!!!!!!!!",
  "GO!?!"
];

module.exports = function(number, tsundere) {
  var returns = []
  if (typeof number === 'undefined' || (isNaN(number) && number != "next tourney")) {
    returns.push("You need to enter a number, baka!");
  } else if (number <= 15) {
    if (tsundere) {
      returns.push("W-Why do I have to do that for you? F-Fine, starting!");
    } else {
      returns.push("Starting!");
    }
    for (var i = number; i >= 0; i--) {
      returns.push(i);
    }
    var random = Math.floor((Math.random() * go.length))
    returns.push(go[random]);
  } else if (number == "next tourney") {
    returns.push("Never.");
  } else {
    returns.push("I'm too dumb to count from that high.");
  }
  return returns;
}

