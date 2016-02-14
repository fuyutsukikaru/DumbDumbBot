exports.colorize = function(irc) {
  return function(text) {
    return irc.colors.wrap("light_magenta", text, "light_magenta");
  }
};
