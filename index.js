const NATS = require('nats');
const discovery = require('./discovery');
const power = require('./power');
const volume = require('./volume');
const channel = require('./channel');
const playback = require('./playback');
const input = require('./input');

exports.handler = (request, context) => {
    var namespace = request.directive.header.namespace;
    var name = request.directive.header.name;

    if (namespace === 'Alexa.Discovery' && name === 'Discover') {
        // Handle the discovery request
        discovery.handle(request, context);
    } else if (namespace === 'Alexa.PowerController') {
        power.handle(request, context);
    } else if (namespace === 'Alexa.Speaker') {
        volume.handle(request, context);
    } else if (namespace === 'Alexa.ChannelController') {
        channel.handle(request, context);
    } else if (namespace === 'Alexa.PlaybackController') {
        playback.handle(request, context);
    } else if (namespace === 'Alexa.InputController') {
        input.handle(request, context);
    }
};