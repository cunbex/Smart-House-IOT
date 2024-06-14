const asyncHandler = require('express-async-handler');
const { getClient } = require('./mqttClient');

// Init MQTT connection
exports.mqttConnect = asyncHandler(async (req, res, next) => {
    if (req.isAuthenticated() && !req.session.mqtt) {
        getClient(req.user.id, req.app.get('wss'));
        req.session.mqtt = true;
    }
    next();
});

exports.mqttEvents = asyncHandler(async (req, res, next) => {
    if (req.isAuthenticated() && req.session.mqtt) {
        getClient(req.user.id, req.app.get('wss'));
    }
    next();
});
