const publishOptions = {
    qos: 1,
    retain: true,
    dup: false,
};
const subscribeOptions = {
    qos: 0,
};

const publishMessage = async (client, controllerId, type, device, value) => {
    if (controllerId !== null) {
        client.publish(
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
const subscribeTopic = async (client, prisma, userId) => {
    const result = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            Controller: true,
        },
    });
    if (result.Controller[0]) {
        client.subscribe(
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
    publishMessage,
    subscribeTopic,
};
