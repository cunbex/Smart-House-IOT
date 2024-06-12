// Function to check if an object exists in the array
function characteristicUuidExists(array, obj) {
    return array.some(
        (item) => item.characteristic.uuid === obj.characteristic.uuid,
    );
}
function manageLocalStorage() {
    const devicesArrayString = localStorage.getItem('devicesArray');
    let devicesArray;
    if (devicesArrayString) {
        devicesArray = JSON.parse(devicesArrayString);
    } else {
        devicesArray = [];
    }
    return devicesArray;
}

function addTableRow(
    deviceName,
    characteristicName,
    characteristicId,
    controllerId,
    inputType,
    inputId,
) {
    // Get the table body
    const tableBody = document.querySelector('#keywords tbody');

    // Create a new table row element
    const newRow = document.createElement('tr');

    // Define the cells content
    const cellsContent = [
        { className: 'lalign', content: deviceName },
        { content: characteristicName },
        { content: characteristicId },
        { content: controllerId },
        {
            className: 'options',
            content: `<input type="${inputType}" name="${deviceName.replace(/\s+/g, '')}" id="${inputId}"><button id="writeDataButtons">Write</button>`,
        },
    ];

    // Append cells to the new row
    cellsContent.forEach((cellData) => {
        const newCell = document.createElement('td');
        if (cellData.className) {
            newCell.className = cellData.className;
        }
        newCell.innerHTML = cellData.content;
        newRow.appendChild(newCell);
    });

    // Append the new row to the table body
    tableBody.appendChild(newRow);
}

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
    const devicesArray = manageLocalStorage();

    // Parse the JSON data
    const parsedData = JSON.parse(event.data);

    if (characteristicUuidExists(devicesArray, parsedData)) {
        devicesArray.forEach((device) => {
            if (
                device.deviceName === parsedData.deviceName &&
                device.characteristic.uuid === parsedData.characteristic.uuid
            ) {
                device.characteristic.value = parsedData.characteristic.value;
            }
        });
    } else {
        devicesArray.push(parsedData);
    }
    if (window.location.pathname === '/devices') {
        devicesArray.forEach((device) => {
            const input = document.querySelector(
                `input[name="${device.deviceName}"][id="${device.characteristic.name}"]`,
            );
            if (input) {
                input.value = device.characteristic.value;
            } else {
                addTableRow(
                    device.deviceName,
                    device.characteristic.name,
                    device.characteristic.uuid,
                    device.controller,
                    'text',
                    device.characteristic.name,
                );
                document.querySelector(
                    `input[name="${device.deviceName}"][id="${device.characteristic.name}"]`,
                ).value = device.characteristic.value;
            }
        });
    }
    localStorage.setItem('devicesArray', JSON.stringify(devicesArray));
};

ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
};
if (window.location.pathname === '/devices') {
    const devicesArray = manageLocalStorage();
    if (devicesArray) {
        devicesArray.forEach((device) => {
            const input = document.querySelector(
                `input[name="${device.deviceName}"][id="${device.characteristic.name}"]`,
            );
            if (input) {
                input.value = device.characteristic.value;
            } else {
                addTableRow(
                    device.deviceName,
                    device.characteristic.name,
                    device.characteristic.uuid,
                    device.controller,
                    'text',
                    device.characteristic.name,
                );
                document.querySelector(
                    `input[name="${device.deviceName}"][id="${device.characteristic.name}"]`,
                ).value = device.characteristic.value;
            }
        });
    }

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
            localStorage.setItem('devicesArray', JSON.stringify(devicesArray));
        });
    });
    console.log(devicesArray);
}
