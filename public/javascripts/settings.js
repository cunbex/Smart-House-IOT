const userId = document.getElementById('user_id');
async function uploadAvatar() {
    try {
        const fileInput = document.getElementById('user_avatar');
        const file = fileInput.files[0];

        // Check if a file is selected
        if (!file) {
            alert('Please select a file.');
            return;
        }

        // Check if the selected file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        // Use FormData to send the file to the API
        const formData = new FormData();
        formData.append('id', userId.textContent);
        formData.append('picture', file);

        // Make an API request to upload the image using fetch
        const response = await fetch(
            'https://smart-house-iot.onrender.com/api/user/post/picture',
            {
                method: 'POST',
                body: formData,
            },
        );

        if (response.ok) {
            alert('Image uploaded successfully!');
            window.location.href = '/settings';
        } else {
            throw new Error('Failed to upload image.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Attach the event listener to the form
const avatarForm = document.getElementById('avatarForm');
avatarForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await uploadAvatar();
});

// Attach the event listener to the form
const nameForm = document.getElementById('nameForm');
nameForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    await updateName();
});

async function updateName() {
    const nameInput = document.getElementById('floating_name').value;

    if (!nameInput.trim()) {
        alert('Please enter a valid name.');
        return;
    }

    try {
        const response = await fetch(
            `https://smart-house-iot.onrender.com/api/user/put/name`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: nameInput,
                    id: userId.textContent,
                }),
            },
        );
        if (response.ok) {
            alert('Name updated successfully!');
            // Redirect to the 'settings' page after successful update
            window.location.href = '/settings';
        } else {
            throw new Error('Failed to update name.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something happened');
    }
}

// Attach the event listener to the password update form
const passwordForm = document.getElementById('passwordForm');
passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    await updatePassword();
});

async function updatePassword() {
    const passwordInput = document.getElementById('floating_password').value;

    if (!passwordInput.trim()) {
        alert('Please enter a valid password.');
        return;
    }

    try {
        const response = await fetch(
            `https://smart-house-iot.onrender.com/api/user/put/password`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: passwordInput,
                    id: userId.textContent,
                }),
            },
        );

        if (response.ok) {
            alert('Password updated successfully!');
            // Redirect to the 'settings' page after successful update
            window.location.href = '/settings';
        } else {
            throw new Error('Failed to update password.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something happened');
    }
}
