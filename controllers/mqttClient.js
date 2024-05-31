const mqtt = require('mqtt');
const fs = require('fs');
const WebSocket = require('ws');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// MQTT broker URL
const brokerUrl = process.env.BROKER_URL;

// Import CA cert
const ca = fs.readFileSync(process.env.CERT_PATH).toString();
const publishOptions = {
    qos: 1,
    retain: true,
    dup: false,
};
const subscribeOptions = {
    qos: 0,
};

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

async function getClient(userId, wss) {
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
        mqttClient.on('close', () => {
            console.log('Disconnected...');
        });
        mqttClient.on('message', (topic, message) => {
            console.log(`RECEIVED: ${message} \n TOPIC: ${topic}`);
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.toString());
                }
            });
        });
        await subscribeTopic(userId);
    } else {
        // Update userId if client is already initialized
        mqttClient.options.username = userId;
        mqttClient.options.clientId = userId;
    }
    return mqttClient;
}

const publishMessage = async (controllerId, type, device, value) => {
    if (controllerId !== null) {
        mqttClient.publish(
            `${controllerId}/${type}/${device}`,
            JSON.stringify(value),
            publishOptions,
            (err) => {
                if (err) {
                    console.error('Error Publishing to topic:', err);
                } else {
                    console.log(
                        `Published to: ${controllerId}/${type}/${device}`,
                    );
                }
            },
        );
    } else {
        console.log('No controller supplied');
    }
};
const subscribeTopic = async (userId) => {
    const result = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            Controller: true,
        },
    });
    if (result.Controller[0]) {
        mqttClient.subscribe(
            [
                `${result.Controller[0].id}/cmd/#`,
                `${result.Controller[0].id}/lwt/`,
                `${result.Controller[0].id}/vlr/#`,
            ],
            {
                subscribeOptions,
            },
            (err, granted) => {
                if (err) {
                    console.error('Error subscribing to topic:', err);
                } else if (granted) {
                    console.log(`Subscribed to: ${JSON.stringify(granted)}`);
                }
            },
        );
    }
};
module.exports = {
    getClient,
    publishMessage,
    subscribeTopic,
};
