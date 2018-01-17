var messaging = require('./messaging');
var mapper = require('./mapper');

exports.handle = function(request, context) {
    // Build the message to be sent to HickHub
    var msg = mapper.mapCommand(request);

    // Send the message, and deal with the response
    messaging.request(request, context, 'test', msg, function(response) {
        // Playback directives don't have any properties to report
        var contextResult = {
            properties:[]
        };

        var alexaResponse = mapper.mapDirectiveResponse(request, contextResult);
        context.succeed(alexaResponse);
    });
};