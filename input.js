var messaging = require('./messaging');
var mapper = require('./mapper');

exports.handle = function(request, context) {
    // Build the message to be sent to HickHub
    var msg = mapper.mapCommand(request);

    // Send the message, and deal with the response
    messaging.request('test', msg, function(response){
        var sampleTime = Date.now();
        var body = JSON.parse(response.body);

        var value = body.input_name;

        var contextResult = {
            properties:[mapper.mapContextProperty('Alexa.InputController', 'input', value, Date.now())]
        };

        var alexaResponse = mapper.mapDirectiveResponse(request, contextResult);
        context.succeed(alexaResponse);
    });
}