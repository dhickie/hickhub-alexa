var client = require('./apiclient');
var mapper = require('./mapper');

exports.handle = function(request, context) {
    // Build the message to be sent to HickHub
    var msg = mapper.mapCommand(request);
    var authToken = mapper.getAuthToken(request, false);

    // Send the message, and deal with the response
    client.request(request, context, msg, authToken, function(response) {
        // Playback directives don't have any properties to report
        var contextResult = {
            properties:[]
        };

        var alexaResponse = mapper.mapDirectiveResponse(request, contextResult);
        console.log(JSON.stringify(alexaResponse));
        context.succeed(alexaResponse);
    });
};