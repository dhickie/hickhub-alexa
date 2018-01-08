const req = require('request');

exports.handler = (request, context) => {
    if (request.directive.header.namespace === 'Alexa.Discovery' && request.directive.header.name === 'Discover') {
        // Handle the discovery request
        handleDiscovery(request, context, "");
    } else if (request.directive.header.namespace === 'Alexa.PowerController') {
        if (request.directive.header.name === 'TurnOff') {
            handlePowerControl(request, context);
        }
        
    }
};

function handleDiscovery(request, context) {
    var payload = {
        "endpoints": [
            {
                "endpointId": "tv1",
                "manufacturerName":"DomInc",
                "friendlyName":"",
                "description":"This is a TV",
                "displayCategories":["TV"],
                "capabilities":[
                    {
                        "type":"AlexaInterface",
                        "interface":"Alexa.PowerController",
                        "version":"3"
                    }
                ]
            }
        ]
    };

    var header = request.directive.header;
    header.name = "Discover.Response";
    context.succeed({event: {header: header, payload: payload}});
}

function handlePowerControl(request, context) {
    // For test purposes this is only ever going to be a power off request
    // Send the turn off request to the designated address
    req.post('http://86.180.23.182:10001/api/tv/tv1/power/off', function (error, response, body) {
        var contextResult = {
            "properties":[{
                "namespace": "Alexa.PowerController",
                "name":"powerState",
                "value":"OFF",
                "timeOfSample":"2018-01-08T22:15:00Z",
                "uncertaintyInMilliseconds":50
            }]
        };
        var responseHeader = request.directive.header;
        responseHeader.name = "Alexa.Response";
        responseHeader.messageId = responseHeader.messageId + "-R";
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