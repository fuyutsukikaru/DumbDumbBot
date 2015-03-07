var config = {
  channels: ["#bugmoney", "#hapchannel", "#qd", "#chromatiqa", "#tanoshimi", "#critics-conn"],
  //channels: ["#thugmoney"],
  server: "irc.rizon.net",
  nick: "DumbDumbBot",
  userName: "DumbDumbBot",
  realName: "DumbDumbBot",
  port: "6667",
  autoRejoin: true,
  autoConnect: true,
  floodProtection: true,
  floodProtectionDelay: "1000",
  messageSplit: "512",
  debug: false,
  showErrors: false,
  selfSigned: false,
  certExpired: false
};

module.exports = config;
