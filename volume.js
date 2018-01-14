var messaging = require('./messaging');
var mapper = require('./mapper');
var time = require('./time');

exports.handle = function(request, context) {
    // Build the message to sent to HickHub
    var msg = mapper.mapCommand(request);

    // Send the message, and deal with the response
    messaging.request('test', msg, function(response) {
        // Create the context properties with the new volume state
        var sampleTime = Date.now();
        var body = JSON.parse(response.body);

        var contextProperties = [];
        contextProperties.push(createContextProperty('volume', body.volume, sampleTime));
        contextProperties.push(createContextProperty('muted', body.is_muted, sampleTime));

        var responseHeader = request.directive.header;
        responseHeader.name = "Alexa.Response";

        var alexaResponse = {
            context: {
                properties: contextProperties
            },
            event: {
                header: responseHeader
            },
            payload:{}
        };

        context.succeed(alexaResponse);
    });
};

function createContextProperty(name, value, sampleTime) {
    return {
        "namespace": "Alexa.Speaker",
        "name": name,
        "value": value,
        "timeOfSample": time.formatDate(sampleTime),
        "uncertaintyInMilliseconds":0
    }
}