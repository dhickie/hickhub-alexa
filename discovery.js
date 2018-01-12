const messaging = require('./messaging');

const capabilityMap = new Map(
    ['power/on', 'Alexa.PowerController'],
    ['power/off', 'Alexa.PowerController'],
    ['volume/set', 'Alexa.Speaker'],
    ['volume/up', 'Alexa.Speaker'],
    ['volume/down', 'Alexa.Speaker'],
    ['volume/mute', 'Alexa.Speaker'],
    ['volume/unmute', 'Alexa.Speaker'],
    ['channel/up', 'Alexa.ChannelController'],
    ['channel/down', 'Alexa.ChannelController'],
    ['channel/set', 'Alexa.ChannelController']
);

exports.handle = function(request, context) {
    // Get the list of devices from the HickHub
    var msg = {
        path: 'api/devices',
        method: 'GET'
    };

    console.info('Publishing discovery request');
    messaging.request('test', msg, function(response){
        var devices = JSON.parse(res.body);

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
}

function assembleEndpoint(device) {
    var endpoint = {
        "endpointId": device.id,
        "manufacturerName":"LG",
        "friendlyName":"",
        "description":"LG WebOS Smart TV",
        "displayCategories":[device.type],
        "capabilities":assembleCapabilities(device.capabilities)
    };

    return endpoint;
}

function assembleCapabilities(capabilities) {
    var assembled = [];
    var set = new Set();
    
    // Only add unique capabilities to the overall list
    capabilities.forEach(function(capability) {
        var mapped = mapCapability(capability);
        if (!set.has(mapped.interface)) {
            assembled.push(mapped);
            set.add(mapped.interface);
        }
    });

    return assembled;
}

function mapCapability(capability) {
    var interfaceName;
    if (capabilityMap.has(capability)) {
        interfaceName = capabilityMap[capability];
    } else {
        interfaceName = '???';
    }

    var mapped = {
        "type":"AlexaInterface",
        "interface":interfaceName,
        "version":"3"
    };

    return mapped;
}