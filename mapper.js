var time = require('./time');

const stateMap = new Map([
    ['Alexa.PowerController', 'power'],
    ['Alexa.Speaker', 'volume'],
    ['Alexa.ChannelController', 'channel'],
    ['Alexa.PlaybackController', 'playback'],
    ['Alexa.InputController', 'input']
]);

const interfaceMap = new Map([
    ['power', 'Alexa.PowerController'],
    ['volume', 'Alexa.Speaker'],
    ['channel', 'Alexa.ChannelController'],
    ['playback', 'Alexa.PlaybackController'],
    ['input', 'Alexa.InputController']
]);

const operationMap = new Map([
    ['play', 'Play'],
    ['pause', 'Pause'],
    ['rewind', 'Rewind'],
    ['fastforward', 'FastForward'],
    ['stop', 'Stop'],
    ['startover', 'StartOver'],
    ['previous', 'Previous'],
    ['next', 'Next']
]);

const commandMap = new Map([
    ['TurnOn', 'on'],
    ['TurnOff', 'off'],
    ['SetVolume', 'set'],
    ['AdjustVolume', 'adjust'],
    ['SetMute', 'setmute'],
    ['ChangeChannel', 'set'],
    ['SkipChannels', 'adjust'],
    ['Play', 'play'],
    ['Pause', 'pause'],
    ['Rewind', 'rewind'],
    ['FastForward', 'fastforward'],
    ['SelectInput', 'set']
]);

exports.mapCommand = function(request) {
    var deviceId = request.directive.endpoint.endpointId;
    var namespace = request.directive.header.namespace;
    var name = request.directive.header.name;

    var state = '???';
    if (stateMap.has(namespace)) {
        state = stateMap.get(namespace);
    }

    var command = '???';
    if (commandMap.has(name)) {
        command = commandMap.get(name);
    }

    var path = `device/${deviceId}/${state}/${command}`;
    
    return {
        path: path,
        method: 'POST',
        body: mapCommandBody(request)
    };
};

exports.mapCapabilityInterface = function(state, capabilities) {
    var interfaceName;
    if (interfaceMap.has(state)) {
        interfaceName = interfaceMap.get(state);
    } else {
        interfaceName = '???';
    }

    // There may be other required properties depending on what interface we're dealing with
    var requiredSupportedOps = false;
    var supportedOperations = [];
    if (interfaceName === 'Alexa.PlaybackController') {
        requiredSupportedOps = true;
        console.log(capabilities);
        capabilities.forEach(function(capability) {
            if (operationMap.has(capability)) {
                supportedOperations.push(operationMap.get(capability));
            }
        });
    }

    // If supported operations have to be specified, and there aren't any, then just
    // return null
    if (requiredSupportedOps && supportedOperations.length === 0) {
        return null;
    }

    var mapped = {
        type: "AlexaInterface",
        interface: interfaceName,
        version:"3"
    };

    if (requiredSupportedOps) {
        mapped.supportedOperations = supportedOperations;
    }

    return mapped;
};

exports.mapDirectiveResponse = function(request, contextResult) {
    var responseHeader = request.directive.header;
    responseHeader.namespace = 'Alexa';
    responseHeader.name = 'Response';

    return {
        context: contextResult,
        event: {
            header: responseHeader
        },
        endpoint: {
            endpointId: request.directive.endpoint.endpointId
        },
        payload: {}
    };
};

exports.mapContextProperty = function(namespace, name, value, sampleTime) {
    return {
        "namespace": namespace,
        "name": name,
        "value": value,
        "timeOfSample": time.formatDate(sampleTime),
        "uncertaintyInMilliseconds":0
    };
};

exports.mapErrorResponse = function(request, errorType, errorMessage) {
    var header = request.directive.header;
    header.namespace = 'Alexa';
    header.name = 'ErrorResponse';

    var response = {
        event: {
            header: header,
            payload: {
                type: errorType,
                message: errorMessage
            }
        }
    };

    if (request.directive.endpoint) {
        response.event.endpoint = {
            endpointId: request.directive.endpoint.endpointId
        };
    }

    return response;
};

function mapCommandBody(request) {
    var namespace = request.directive.header.namespace;
    var name = request.directive.header.name;
    var payload = request.directive.payload;

    if (namespace === 'Alexa.Speaker') {
        if (name === 'AdjustVolume' || name === 'SetVolume') {
            return JSON.stringify(payload.volume);
        } else if (name === 'SetMute') {
            return JSON.stringify(payload.mute);
        }
    } else if (namespace === 'Alexa.ChannelController') {
        if (name === 'ChangeChannel') {
            return JSON.stringify({
                exact_channel_number: Number(payload.channel.number),
                exact_channel_name: payload.channel.callSign,
                fuzzy_channel_identifier: payload.channelMetadata.name
            });
        } else if (name === 'SkipChannels') {
            return JSON.stringify(payload.channelCount);
        }
    } else if (namespace === 'Alexa.InputController') {
        if (name === 'SelectInput') {
            return JSON.stringify(payload.input);
        }
    }

    return '';
}