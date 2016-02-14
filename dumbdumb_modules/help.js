module.exports = function(command) {
  if (!command) {
    return "Enter !help <command> from these commands to find out more: hi, bye, goaway, countdown, remind, tweet, search, hide, shindan, roulette, senpai, face, rawr, tsundere, petite, lolicon, person";
  } else {
    var help = {
      "hi": "Enter !hi or !sup to have DumbDumbBot greet you!",
      "bye": "Enter !bye to have DumbDumbBot see you off!",
      "goaway": "Enter !goaway <name of person> to have DumbDumbBot be rude to a person.",
      "countdown": "Enter !countdown <number> to have DumbDumbBot start a countdown! Limited to numbers under 15.",
      "remind": "Enter !remind <minutes> <message> to have DumbDumbBot remind you of things.",
      "tweet": "Enter !tweet <message to send> to post a tweet.",
      "search": "Enter !search <source> <query> to find something on MAL or Google",
      "hide": "Use the !hide command to prevent DumbDumbBot from posting the titles of YouTube videos and VNs.",
      "shindan": "Enter !saki, !yakuman, !aikatsu, or !pripara to roll a Shindan for the day!",
      "roulette": "Enter !roulette <choices separated by spaces> to have DumbDumbBot randomly pick something for you.",
      "senpai": "Enter !senpai to ask DumbDumbBot if senpai has noticed you.",
      "face": "Enter !:O, !:(, !XD, !>_<, !:9, !:), !mibucchi, !meball  to have DumbDumbBot express her emotions.",
      "rawr": "Enter !rawr to see how scary DumbDumbBot can be!",
      "tsundere": "Enter !tsundere on to make DumbDumbBot a tsundere, and !tsundere off to make her normal again!",
      "petite": "Enter !petite to find out if you're a lolicon.",
      "lolicon": "Enter !lolicon to find out if you're a lolicon.",
      "person": "Enter !opn for a special command",
      "default": "Not a valid option."
    }
    return (help[command] || help["default"]);
  }
}
