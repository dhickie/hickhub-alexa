const NATS = require('nats');
const mapper = require('./mapper')

exports.request = function(request, context, topic, message, callback) {
    var nats = NATS.connect(process.env.NATS_Server);
    var msg = JSON.stringify(message);

    nats.requestOne(topic, msg, {}, 1000, function(response) {
        // Close the connection when we get a response
        nats.close();

        // Process the response message
        console.info('Received response: ' + response);

        var errorType = '';
        var errorMessage = '';

        // Check if we timed out trying to get a response
        if (String(response).startsWith('NatsError')) {
            console.error('Timed out receiving response to request');

            errorType = 'BRIDGE_UNREACHABLE';
            errorMessage = "Unable to reach target HickHub.";
        } else {
            var resp = JSON.parse(response);
            if (resp.status !== "200 OK") {
                console.error('Response was an error response: ' + resp.body);

                errorType = 'INTERNAL_ERROR';
                errorMessage = resp.body;
            } else {
                callback(resp);
            }
        }

        if (errorMessage !== '') {
            var errorResponse = mapper.mapErrorResponse(request, errorType, errorMessage);
            context.succeed(errorResponse);
        }
    });
};