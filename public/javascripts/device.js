const devicesArray = [];
// Function to check if an object exists in the array
function objectExists(array, obj) {
    return array.some((item) => JSON.stringify(item) === JSON.stringify(obj));
}
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
    // Parse the JSON data
    const parsedData = JSON.parse(event.data);
    if (!objectExists(devicesArray, parsedData)) {
        devicesArray.push(parsedData);
    }
    devicesArray.forEach((devices) => {
        const { device } = devices;
        const characteristics = Object.keys(devices.characteristics);
        const values = Object.values(devices.characteristics);
        characteristics.forEach((characteristic, index) => {
            const input = document.querySelector(
                `input[name="${device}"][id="${characteristic}"]`,
            );
            if (input) {
                input.value = values[index];
            }
        });
    });
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

const inputs = document.querySelectorAll('input');
inputs.forEach((input) => {
    input.addEventListener('input', (event) => {
        const { name } = event.target;
        const { id } = event.target;
        const { value } = event.target;

        // Update the corresponding object in devicesArray
        devicesArray.forEach((obj) => {
            if (
                obj.device === name &&
                obj.characteristics !== undefined &&
                obj.characteristics[id] !== undefined
            ) {
                obj.characteristics[id] = value;
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(obj));
                } else {
                    console.error('WebSocket is not open.');
                }
            }
        });
    });
});
