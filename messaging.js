const NATS = require('nats');

exports.request = function(topic, message, callback) {
    var nats = NATS.connect("");
    var msg = JSON.stringify(message);

    nats.requestOne(topic, msg, {}, 1000, function(response) {
        // Close the connection when we get a response
        nats.close();

        // Process the response message
        var resp = JSON.parse(response);
        if (resp.code && resp.code === nats.REQ_TIMEOUT) {
            console.error('Timed out receiving response to request');
        } else {
            if (resp.status !== "200 OK") {
                console.error('Received error response to request: ' + response);
            } else {
                console.info('Received success response to request: ' + response);
                callback(resp);
            }
        }
    });
};