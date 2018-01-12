exports.formatDate = function(dateMillis) {
    var date = new Date(dateMillis);

    var year = date.getFullYear();
    var month = zeroPad(date.getMonth() + 1);
    var day = zeroPad(date.getDate());
    var hour = zeroPad(date.getHour());
    var min = zeroPad(date.getMinutes());
    var sec = zeroPad(date.getSeconds());

    return `${year}-${month}-${day}T${hour}:${min}:${sec}Z`;
}

function zeroPad(val) {
    if (val < 10) {
        return '0' + val;
    } else {
        return val;
    }
}