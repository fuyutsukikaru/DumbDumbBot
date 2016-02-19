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
  "GO!?!",
  "行くぞぉぉ",
  "行きます",
  "行きますよぉ~",
  "pshuu",
  "いきま~す",
  "行くわよ",
  "START",
  "igo",
  "Dolphy is the best imo",
  "igo yoroshiku~",
  "cure up rapapa",
  "Am I just a robot to you???",
  "butts",
  "7",
  "OOOOHOHOHOHOHOHOHO",
  "fufufu",
  "kakaka",
  "You guys probably messed up the timing。",
  "du du wa do it",
  "STOP",
  "てへぺろ",
  "gopher",
  "go home"
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
    for (var i = number; i > 0; i--) {
      returns.push(i);
    }
    var random = Math.floor((Math.random() * go.length));
    if (tsundere) {
      returns.push("死ね");
    } else {
      returns.push(go[random]);
    }
  } else if (number == "next tourney") {
    returns.push("Never.");
  } else {
    returns.push("I'm too dumb to count from that high.");
  }
  return returns;
}

