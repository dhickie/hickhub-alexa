const NATS = require('nats');
const mapper = require('./mapper')

exports.request = function(request, context, topic, message, callback) {
    var nats = NATS.connect(process.env.NATS_Server);
    var msg = JSON.stringify(message);

    // Allow 5 seconds for the response from the HickHub
    nats.requestOne(topic, msg, {}, 5000, function(response) {
        // Close the connection when we get a response
        nats.close();

        // Process the response message
        console.info('Received response: ' + response);

        var errorThrown = false;
        var errorType = '';
        var errorMessage = '';

        // Check if we timed out trying to get a response
        if (String(response).startsWith('NatsError')) {
            console.error('Timed out receiving response to request');

            errorThrown = true;
            errorType = 'BRIDGE_UNREACHABLE';
            errorMessage = "Unable to reach target HickHub.";
        } else {
            var resp = JSON.parse(response);
            if (resp.status !== "200 OK") {
                console.error('Response was an error response: ' + resp.body);

                errorThrown = true;
                errorType = 'INTERNAL_ERROR';
                errorMessage = resp.body;
            } else {
                callback(resp);
            }
        }

        if (errorThrown) {
            var errorResponse = mapper.mapErrorResponse(request, errorType, errorMessage);
            context.succeed(errorResponse);
        }
    });
};