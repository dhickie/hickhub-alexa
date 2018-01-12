var messaging = require('./messaging');
var time = require('./time');

exports.handle = function(request, context) {
    // Build an appropriate message based on the type of directive
    var deviceId = request.directive.endpoint.endpointId;
    var directiveName = request.directive.header.name;
    var payload = request.directive.payload;

    var msg = {
        path: '',
        body: '',
        method: 'POST'
    };

    if (directiveName === 'SetVolume') {
        msg.path = `api/device/${deviceId}/volume/set`;
        msg.body = `${payload.volume}`;
    } else if (directiveName === 'AdjustVolume') {
        if (payload.volume < 0) {
            msg.path = `api/device/${deviceId}/volume/down`;
        } else {
            msg.path = `api/device/${deviceId}/volume/up`;
        }
    } else if (directive === 'SetMute') {
        if (payload.mute) {
            msg.path = `api/device/${deviceId}/volume/mute`;
        } else {
            msg.path = `api/device/${deviceId}/volume/unmute`;
        }
    } else {
        // TODO: Report an unknown directive name
        return;
    }


}