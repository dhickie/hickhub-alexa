var messaging = require('./messaging');
var mapper = require('./mapper');
var time = require('./time');

exports.handle = function(request, context) {
    // Build the message to send to HickHub
    var msg = mapper.mapCommand(request);

    // Send the message, and deal with the response
    messaging.request('test', msg, function(response){
        var powerState = 'OFF';
        if (response.body.power_on) {
            powerState = 'ON'
        }

        var contextResult = {
            "properties":[{
                "namespace": "Alexa.PowerController",
                "name":"powerState",
                "value":powerState,
                "timeOfSample":time.formatDate(Date.now()),
                "uncertaintyInMilliseconds":50
            }]
        }

        var responseHeader = request.directive.header;
        responseHeader.name = "Alexa.Response";

        var alexaResponse = {
            context: contextResult,
            event: {
                header: responseHeader
            },
            payload:{}
        };

        context.succeed(alexaResponse);
    });
};