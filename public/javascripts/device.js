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
    devicesArray.forEach((device) => {
        const input = document.querySelector(
            `input[name="${device.deviceName}"][id="${device.characteristic.name}"]`,
        );
        if (input) {
            input.value = device.characteristic.value;
        }
    });
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
};
if (window.location.pathname === '/devices') {
    const buttons = document.querySelectorAll('#writeDataButtons');
    buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const input = button.previousElementSibling;
            const { name } = input;
            const { id } = input;
            const { value } = input;
            // Update the corresponding object in devicesArray
            devicesArray.forEach((device) => {
                if (
                    device.deviceName === name &&
                    device.characteristic.name === id
                ) {
                    device.characteristic.value = value;
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify(device));
                    } else {
                        console.error('WebSocket is not open.');
                    }
                }
            });
        });
    });
}
