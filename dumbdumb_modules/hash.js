module.exports = function(from) {
    var len = from.length;
    var first = from.charCodeAt(0);
    var last = from.charCodeAt(len-1);
    var d = new Date();
    var date = d.getDate();
    var day = d.getDay();
    var year = d.getFullYear();
    var month = d.getMonth();
    return (len + first + last) * (date + first + year) * (day + last + month) * (month + date);
}
