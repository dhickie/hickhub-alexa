var messaging = require('./messaging');
var time = require('./time');

exports.handle = function(request, context) {
    // Build the request we want to make based on whether this is "TurnOn" or "TurnOff"
    var deviceId = request.directive.endpoint.endpointId;
    var msg = {
        path: '',
        method: 'POST'
    };
    
    var isOn = false;
    if (request.directive.header.name === 'TurnOn') {
        isOn = true;
        msg.path = `api/device/${deviceId}/power/on`;
    } else {
        msg.path = `api/device/${deviceId}/power/off`;
    }

    messaging.request('test', msg, function(response){
        var powerState = 'OFF';
        if (isOn) {
            powerState = 'ON';
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
}