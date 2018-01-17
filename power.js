var messaging = require('./messaging');
var mapper = require('./mapper');

exports.handle = function(request, context) {
    // Build the message to send to HickHub
    var msg = mapper.mapCommand(request);

    // Send the message, and deal with the response
    messaging.request(request, context, 'test', msg, function(response){
        var powerState = 'OFF';
        if (response.body.power_on) {
            powerState = 'ON'
        }

        var contextResult = {
            properties:[mapper.mapContextProperty('Alexa.PowerController', 'powerState', powerState, Date.now())]
        };

        var alexaResponse = mapper.mapDirectiveResponse(request, contextResult);
        context.succeed(alexaResponse);
    });
};