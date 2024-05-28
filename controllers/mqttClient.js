const mqtt = require('mqtt');
const fs = require('fs');
const WebSocket = require('ws');
const { publishMessage } = require('./mqttPubSub');
// MQTT broker URL
const brokerUrl = process.env.BROKER_URL;

// Import CA cert
const ca = fs.readFileSync(process.env.CERT_PATH).toString();

let mqttClient;

const options = {
    protocolId: 'MQTT',
    protocolVersion: 4,
    keepalive: 3600,
    reconnectPeriod: 5 * 1000,
    connectTimeout: 6 * 1000,
    password: process.env.BROKER_PASSWORD,
    clean: false,
    ca,
};

function getClient(userId, wss) {
    if (!mqttClient) {
        options.clientId = userId;
        options.username = userId;
        options.will = {
            topic: `${userId}/lwt`,
            payload: `${userId} disconnected without a reason`,
            qos: 0,
            retain: false,
        };
        mqttClient = mqtt.connect(brokerUrl, options);

        // Message Event handlers
        mqttClient.on('connect', () => {
            console.log('Connected to MQTT broker');
        });
        mqttClient.on('reconnect', () => {
            console.log('Reconnecting...');
        });
        mqttClient.on('error', (err) => {
            console.error('MQTT client error:', err);
        });
        mqttClient.on('message', (topic, message) => {
            console.log(`RECEIVED: ${message}`);
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.toString());
                }
            });
        });
    } else {
        // Update userId if client is already initialized
        mqttClient.options.username = userId;
        mqttClient.options.clientId = userId;
    }
    return mqttClient;
}
function webSockets(data) {
    publishMessage(
        mqttClient,
        data.controller,
        data.type,
        data.device,
        data.characteristics,
    );
    console.log('Received message:', data);
}
module.exports = {
    getClient,
    webSockets,
};
