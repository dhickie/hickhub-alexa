var client = require('./apiclient');
var mapper = require('./mapper');

exports.handle = function(request, context) {
    // Build the message to sent to HickHub
    var msg = mapper.mapCommand(request);
    var authToken = mapper.getAuthToken(request, false);

    // Send the message, and deal with the response
    client.request(request, context, msg, authToken, function(response) {
        // Create the context properties with the new volume state
        var sampleTime = Date.now();
        var body = JSON.parse(response.body);

        var contextProperties = [];
        contextProperties.push(mapper.mapContextProperty('Alexa.Speaker', 'volume', body.volume, sampleTime));
        contextProperties.push(mapper.mapContextProperty('Alexa.Speaker', 'muted', body.is_muted, sampleTime));

        var contextResult = {
            properties: contextProperties
        };

        var alexaResponse = mapper.mapDirectiveResponse(request, contextResult);
        context.succeed(alexaResponse);
    });
};