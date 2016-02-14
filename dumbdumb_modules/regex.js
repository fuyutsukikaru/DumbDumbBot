exports.thanks = function(regex, text) {
  var matchWord = regex.exec(text)[1].toLowerCase();
  var truncatedRegex = /[aeiou].*/;
  var truncatedMatch = truncatedRegex.exec(matchWord);
  if (truncatedMatch !== null) {
    return "Th" + truncatedMatch;
  } else {
    return "Pshuu";
  }
}

exports.bless = function(regex, text) {
  var matchWord = regex.exec(text)[1].toLowerCase();
  var truncatedRegex = /[aeiou].*/;
  var truncatedMatch = truncatedRegex.exec(matchWord);
  if (truncatedMatch !== null) {
    return "Bl" + truncatedMatch;
  } else {
    return "Pshuu";
  }
}
