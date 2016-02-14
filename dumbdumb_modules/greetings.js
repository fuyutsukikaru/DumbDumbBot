exports.hello = function(from, tsundere) {
  if (from == "DDK") {
    return "H-Hi " + from;
  } else {
    if (tsundere) {
      return "I-It's not like I wanted to see you or anything " + from;
    } else {
      return "HI " + from.toUpperCase();
    }
  }
}

exports.goodbye = function(from, tsundere) {
  if (!tsundere) {
    return "BYE " + from.toUpperCase();
  } else {
    return "G-Goodbye...baka.";
  }
}

exports.rawr = function(tsundere) {
  if (tsundere) {
    return "Haaaaa? Are you stupid or something?";
  } else {
    return "Gao gao! I'm verrrryyyy scary. Fear me! Gao!";
  }
}

exports.goaway = function(rest, tsundere) {
  if (tsundere) {
    return "I-It's not like I want you to go or anything " + rest;
  } else {
    return "Rawr, go away " + rest + ", I hate you!!!";
  }
}
