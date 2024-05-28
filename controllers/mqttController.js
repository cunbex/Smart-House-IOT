const asyncHandler = require('express-async-handler');
const { getClient } = require('./mqttClient');
const { subscribeTopic } = require('./mqttPubSub');
// Init MQTT connection
exports.mqttConnect = asyncHandler(async (req, res, next) => {
    if (req.isAuthenticated() && !req.session.mqtt) {
        const client = getClient(req.user.id, req.app.get('wss'));
        client.on('close', () => {
            req.session.mqtt = false;
            console.log('Disconnected...');
        });
        req.session.mqtt = true;
        await subscribeTopic(client, req.prisma, req.user.id);
    }
    next();
});

exports.mqttEvents = asyncHandler(async (req, res, next) => {
    if (req.isAuthenticated() && req.session.mqtt) {
        getClient(req.user.id, req.app.get('wss'));
    }
    next();
});
