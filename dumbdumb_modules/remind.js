module.exports = function(from, time, message) {
  var returns = [];
  if (!isNaN(time)) {
    returns.push(true);
    returns.push("Reminder set for " + from);
  } else {
    returns.push(false);
    returns.push("Need to set a valid number of minutes!");
  }
  return returns;
}
