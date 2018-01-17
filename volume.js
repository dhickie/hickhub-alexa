var messaging = require('./messaging');
var mapper = require('./mapper');

exports.handle = function(request, context) {
    // Build the message to sent to HickHub
    var msg = mapper.mapCommand(request);

    // Send the message, and deal with the response
    messaging.request(request, context, 'test', msg, function(response) {
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