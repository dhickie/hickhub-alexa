var client = require('./apiclient');
var mapper = require('./mapper');

exports.handle = function(request, context) {
    // Build the message to be sent to HickHub
    var msg = mapper.mapCommand(request);
    var authToken = mapper.getAuthToken(request, false);

    // Send the message, and deal with the response
    client.request(request, context, msg, authToken, function(response){
        var body = JSON.parse(response.body);

        var value = {
            "number": body.channel_number,
            "callSign": body.channel_name,
            "affiliateCallSign": body.channel_name
        };

        var contextResult = {
            properties:[mapper.mapContextProperty('Alexa.ChannelController', 'channel', value, Date.now())]
        };

        var alexaResponse = mapper.mapDirectiveResponse(request, contextResult);
        context.succeed(alexaResponse);
    });
}