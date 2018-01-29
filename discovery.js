const client = require('./apiclient');
const mapper = require('./mapper');

exports.handle = function(request, context) {
    // Get the list of devices from the HickHub
    var msg = {
        path: 'devices',
        method: 'GET'
    };
    var authToken = mapper.getAuthToken(request, true);

    console.info('Publishing discovery request');
    client.request(request, context, msg, authToken, function(response){
        var devices = JSON.parse(response.body);

        // Assemble the endpoints
        var endpoints = [];
        devices.forEach(function(device) {
            endpoints.push(assembleEndpoint(device));
        });

        var payload = {
            "endpoints":endpoints
        };

        // Return the discovered devices
        var header = request.directive.header;
        header.name = "Discover.Response";
        context.succeed({event:{header:header, payload:payload}});
    });
};

function assembleEndpoint(device) {
    var endpoint = {
        "endpointId": device.id,
        "manufacturerName":"LG",
        "friendlyName":"TV",
        "description":"LG WebOS Smart TV",
        "displayCategories":[device.type],
        "capabilities":assembleCapabilities(device.capabilities)
    };

    return endpoint;
}

function assembleCapabilities(capabilities) {
    var assembled = [];

    var keys = Object.keys(capabilities);
    keys.forEach(function(capability) {
        var mappedCapability = mapper.mapCapabilityInterface(capability, capabilities[capability]);
        if (mappedCapability) {
            assembled.push(mappedCapability);
        }
    });

    return assembled;
}