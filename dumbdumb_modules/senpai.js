module.exports = function(tsundere) {
  var random = Math.floor((Math.random() * 10));
  if (random == 0) {
    if (tsundere) {
      return "B-Baka! S-Senpai noticed you...";
    } else {
      return "Senpai noticed you!";
    }
  }
  else {
    if (tsundere) {
      return "H-Hmph! S-So what if senpai didn't notice you?";
    } else {
      return "Senpai will never notice you...";
    }
  }
}
