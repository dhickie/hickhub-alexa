const stateMap = new Map([
    ['Alexa.PowerController', 'power'],
    ['Alexa.Speaker', 'volume']
]);

const commandMap = new Map([
    ['TurnOn', 'on'],
    ['TurnOff', 'off'],
    ['SetVolume', 'set'],
    ['AdjustVolume', 'adjust'],
    ['SetMute', 'setmute']
]);

const interfaceMap = new Map([
    ["power", 'Alexa.PowerController'],
    ["volume", 'Alexa.Speaker'],
    ["channel", 'Alexa.ChannelController']
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

exports.mapCapabilityInterface = function(state) {
    var interfaceName;
    if (interfaceMap.has(state)) {
        interfaceName = interfaceMap.get(state);
    } else {
        interfaceName = '???';
    }

    var mapped = {
        "type":"AlexaInterface",
        "interface":interfaceName,
        "version":"3"
    };

    return mapped;
};

function mapCommandBody(request) {
    var namespace = request.directive.header.namespace;
    var name = request.directive.header.name;
    var payload = request.directive.payload;

    if (namespace === 'Alexa.Speaker') {
        if (name === 'AdjustVolume' || name === 'SetVolume') {
            return String(payload.volume);
        } else if (name === 'SetMute') {
            return String(payload.mute);
        }
    }

    return '';
}