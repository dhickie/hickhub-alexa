const NATS = require('nats');

exports.request = function(topic, message, callback) {
    var nats = NATS.connect("");
    var msg = JSON.stringify(message);

    nats.requestOne(topic, msg, {}, 1000, function(response){
        if (response.code && response.code === nats.REQ_TIMEOUT) {
            console.error('Timed out receiving response to request');
        } else {
            var res = JSON.parse(response);
            if (res.status != "200 OK") {
                console.error('Received error response to request: ' + response);
            } else {
                console.info('Received success response to request: ' + response);
                callback(res);
            }
        }
    });
}