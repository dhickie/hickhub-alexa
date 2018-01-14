const NATS = require('nats');
const discovery = require('./discovery');
const power = require('./power');
const volume = require('./volume');

exports.handler = (request, context) => {
    if (request.directive.header.namespace === 'Alexa.Discovery' && request.directive.header.name === 'Discover') {
        // Handle the discovery request
        discovery.handle(request, context);
    } else if (request.directive.header.namespace === 'Alexa.PowerController') {
        power.handle(request, context);
    } else if (request.directive.header.namespace === 'Alexa.Speaker') {
        volume.handle(request, context);
    }
};