const NATS = require('nats');

exports.request = function(topic, message, callback) {
    var nats = NATS.connect(process.env.NATS_Server);
    var msg = JSON.stringify(message);

    nats.requestOne(topic, msg, {}, 1000, function(response) {
        // Close the connection when we get a response
        nats.close();

        // Process the response message
        console.info('Received response: ' + response);
        var resp = JSON.parse(response);
        if (resp.code && resp.code === nats.REQ_TIMEOUT) {
            console.error('Timed out receiving response to request');
        } else {
            if (resp.status !== "200 OK") {
                console.error('Response was an error response: ' + resp.body);
            } else {
                callback(resp);
            }
        }
    });
};