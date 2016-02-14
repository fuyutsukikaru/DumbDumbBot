module.exports = function(choices, tsundere) {
  var options = choices.length;
  var random = Math.floor((Math.random() * options));
  if (tsundere) {
    return "Something like " + choices[random] + " is good enough for trash like you.";
  } else {
    return "I choose " + choices[random];
  }
}
