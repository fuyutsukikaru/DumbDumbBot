var config = {
  channels: ["#hapchannel", "#qd", "#tanoshimi", "#critics-conn", "#anitwitter"],
  //channels: ["#thugmoney"],
  server: "irc.rizon.net",
  nick: "DumbDumbBot",
  userName: "DumbDumbBot",
  realName: "DumbDumbBot",
  port: "6667",
  autoRejoin: true,
  autoConnect: true,
  floodProtection: true,
  floodProtectionDelay: "500",
  messageSplit: "512",
  debug: false,
  showErrors: false,
  selfSigned: false,
  certExpired: false
};

module.exports = config;
