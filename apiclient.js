const request = require('request')
const mapper = require('./mapper')

exports.request = function(req, context, message, authToken, callback) {
    var msg = JSON.stringify(message);

    // Build the request options
    var options = {
        url: `${process.env.HickHub_API}/user/messaging/request`,
        method: 'POST',
        body: msg,
        headers: {
            'Authorization': 'Bearer ' + authToken
        },
        timeout: 5000
    };

    // Make the request
    request(options, function(error, response, body) {
        // Process the response
        console.info('Received response: ' + response);

        var errorThrown = false;
        var errorType = '';
        var errorMessage = '';
        if (error || response.statusCode != '200') {
            console.error('Error occured calling the HickHub API: ' + error);
            errorThrown = true;
            errorType = 'BRIDGE_UNREACHABLE';
            errorMessage = 'Unable to reach target HickHub.';
        } else {
            var resp = JSON.parse(body);
            if (String(resp.status).startsWith('400')) {
                console.error('Response was a bad request response: ' + resp.body);
                errorThrown = true;
                errorType = 'INVALID_DIRECTIVE';
                errorMessage = resp.body;
            } else if (!String(resp.status).startsWith('200')) {
                console.error('Response was an error response: ' + resp.body);
                errorThrown = true;
                errorType = 'INTERNAL_ERROR';
                errorMessage = resp.body;
            } else {
                callback(resp);
            }
        }

        if (errorThrown) {
            var errorResponse = mapper.mapErrorResponse(req, errorType, errorMessage);
            context.succeed(errorResponse);
        }
    });
};