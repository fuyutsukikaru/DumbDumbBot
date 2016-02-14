module.exports = function(type, from, tsundere) {
  if (type == "!petite") {
    if (from == "DDK") {
      return "I'm  DEFINITELY not a lolicon, I just like petite girls! *wink wink*";
    }
    else if (from == "Piroko" || from == "kafushino") {
      return "This is the FBI. Please take a seat.";
    }
    else if (from == "LoliSenpai" || from == "Restinya") {
      return "I'm a lolicon! XD";
    } else {
      if (tsundere) {
        return "I-It's not like I like lolis or anything, stupid, I just like them petite!";
      } else {
        return "I'm not a lolicon, I just like petite girls!";
      }
    }
  } else if (type == "!lolicon") {
    if (tsundere) {
      return "YOU LOLICON-HENTAI!!!";
    } else {
      return "No just lol-";
    }
  }
}
