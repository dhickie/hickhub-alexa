var client = require('./apiclient');
var mapper = require('./mapper');

exports.handle = function(request, context) {
    // Build the message to be sent to HickHub
    var msg = mapper.mapCommand(request);
    var authToken = mapper.getAuthToken(request, false);

    // Send the message, and deal with the response
    client.request(request, context, msg, authToken, function(response){
        var body = JSON.parse(response.body);

        var value = body.input_name;

        var contextResult = {
            properties:[mapper.mapContextProperty('Alexa.InputController', 'input', value, Date.now())]
        };

        var alexaResponse = mapper.mapDirectiveResponse(request, contextResult);
        context.succeed(alexaResponse);
    });
};