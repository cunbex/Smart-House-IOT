// sets proper fullscreen height for mobile
vhCheck();

// scrolls to bottom to ensure form is visible when filling inputs on mobile
document.querySelectorAll('input').forEach((input) => {
    if (window.innerWidth < 420) {
        input.addEventListener('focusin', () => {
            setTimeout(() => {
                window.scrollBy(0, window.innerHeight);
            }, 150);
        });
    }
});

// sets blur filter to the outside of the content container on desktop
function setBlurMask() {
    const main = document.querySelector('main');
    const size = main.getBoundingClientRect();
    const blur = document.querySelector('.blur');
    const blurSize = blur.getBoundingClientRect();
    const topPercent = `${(size.top / blurSize.height) * 100}%`;
    const leftPercent = `${(size.left / blurSize.width) * 100}%`;
    const bottomPercent = `${(size.bottom / blurSize.height) * 100}%`;
    const rightPercent = `${(size.right / blurSize.width) * 100}%`;
    document
        .querySelector(':root')
        .style.setProperty(
            '--mask',
            `polygon(0% 0%, 0% 100%, ${leftPercent} 100%, ${leftPercent} ${topPercent}, ${rightPercent} ${topPercent}, ${rightPercent} ${bottomPercent}, ${leftPercent} ${bottomPercent}, ${leftPercent} 100%, 100% 100%, 100% 0%)`,
        );
}

// sets width and properly centers the password strength meter
function placeStrengthMeter() {
    const indicator = document.querySelector('.indicator');
    const inputEl = document.querySelector('#password');
    indicator.style.width = `${inputEl.clientWidth * 0.4}px`;
    indicator.style.right = `${parseFloat(window.getComputedStyle(inputEl).paddingRight) + 5}px`;
}

window.addEventListener('resize', () => {
    setBlurMask();
    placeStrengthMeter();
});
placeStrengthMeter();

// apply blur mask after page finishes loading
window.addEventListener('load', () => {
    setBlurMask();
});

// highlight form field on focus
document.querySelectorAll('.input-group').forEach((group) => {
    group.addEventListener('focusin', (event) => {
        const target = event.currentTarget;
        target.classList.add('active');
        target.children[2].classList.add('active');

        // show strength indicator when password field selected
        if (target.children[2].id === 'password') {
            document.querySelector('.indicator').classList.remove('hide');
        }
    });

    // validates on focusout
    group.addEventListener('focusout', (event) => {
        const target = event.currentTarget;
        target.classList.remove('active');
        target.children[2].classList.remove('active');
        const valid = validateInput(target.children[2]);
        document.querySelector('.indicator').classList.add('hide');
        if (!valid) {
            showError(target.children[2]);
        }
    });
});

// aggressively validates inputs if in invalid state
document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', (event) => {
        if (
            event.target.classList.contains('valid') ||
            event.target.classList.contains('invalid')
        ) {
            validateInput(input);
        }
        // turns button green when form is considered valid
        setTimeout(() => {
            if (
                [...document.querySelectorAll('input')].every((input) =>
                    input.classList.contains('valid'),
                )
            ) {
                document.querySelector('button').classList.add('strong');
            } else if (
                document.querySelector('button').classList.contains('strong')
            ) {
                document.querySelector('button').classList.remove('strong');
            }
        }, 1);
    });
});

// shows valid state for password confirm field once passwords match
if (document.querySelector('#confirm')) {
    document.querySelector('#confirm').addEventListener('input', (event) => {
        const { target } = event;
        const password = document.querySelector('#password').value;
        if (target.value === password) {
            target.classList.add('valid');
        }
    });
}

// checks password strength and fills strength bar
document.querySelector('#password').addEventListener('input', (event) => {
    const strength = testStrength(event.target.value);
    switch (strength) {
        case 'strong':
            document.querySelector('.strong').classList.remove('transparent');
            document.querySelector('.medium').classList.remove('transparent');
            break;
        case 'medium':
            document.querySelector('.strong').classList.add('transparent');
            document.querySelector('.medium').classList.remove('transparent');
            break;
        case 'weak':
            document.querySelector('.strong').classList.add('transparent');
            document.querySelector('.medium').classList.add('transparent');
            break;
    }

    // if confirm is not empty, compare it to password
    if (
        document.querySelector('#confirm') &&
        document.querySelector('#confirm').value !== ''
    ) {
        const valid =
            document.querySelector('#confirm').value === event.target.value;
        if (valid) {
            document.querySelector('#confirm').classList.remove('invalid');
            document.querySelector('#confirm').classList.add('valid');
        } else {
            document.querySelector('#confirm').classList.remove('valid');
            document.querySelector('#confirm').classList.add('invalid');
        }
    }
});

// shake button and invalid inputs when trying to submit with invalid/unfilled inputs
if (document.querySelector('#signUpButton')) {
    document
        .querySelector('#signUpButton')
        .addEventListener('click', (event) => {
            event.preventDefault();
            const inputs = [...document.querySelectorAll('input')];
            const inputValues = {};
            if (!inputs.every((input) => input.classList.contains('valid'))) {
                document.querySelector('button').classList.add('shake');
                document.querySelectorAll('input').forEach((input) => {
                    if (
                        !input.classList.length ||
                        input.classList.contains('invalid')
                    ) {
                        input.classList.add('shake');
                    }
                    setTimeout(() => {
                        input.classList.remove('shake');
                    }, 600);
                });

                setTimeout(() => {
                    document.querySelector('button').classList.remove('shake');
                }, 600);
            } else {
                // Iterate over inputs to retrieve values
                inputs.forEach((input) => {
                    const inputName = input.getAttribute('name'); // Assuming inputs have 'name' attribute
                    const inputValue = input.value;
                    inputValues[inputName] = inputValue;
                });
                fetch('http://localhost:8080/api/user/post/record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: inputValues.name,
                        email: inputValues.email,
                        password: inputValues.password,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success === false && data.status === 409) {
                            const failedEmail =
                                document.querySelector('#email');
                            failedEmail.classList.add('invalid');
                            failedEmail.classList.remove('valid');
                            showError(failedEmail, data.message);
                        } else {
                            setTimeout(() => {
                                window.location.href = '/';
                            }, 1);
                        }
                        document
                            .querySelector('button')
                            .classList.remove('strong');
                    });
                // animate checkmark on valid form submit
                const checkmark = document.querySelector('.checkmark');
                document
                    .querySelector('button')
                    .firstElementChild.classList.add('invisible');
                checkmark.classList.remove('hide');
                setTimeout(() => {
                    checkmark.classList.add('grow');
                }, 100);

                setTimeout(() => {
                    checkmark.classList.remove('grow');
                    checkmark.classList.add('hide');
                    document
                        .querySelector('button')
                        .firstElementChild.classList.remove('invisible');
                }, 1200);
            }
        });
}

if (document.querySelector('#logInButton')) {
    document
        .querySelector('#logInButton')
        .addEventListener('click', (event) => {
            event.preventDefault();
            const inputs = [...document.querySelectorAll('input')];
            const inputValues = {};
            if (!inputs.every((input) => input.classList.contains('valid'))) {
                document.querySelector('button').classList.add('shake');
                document.querySelectorAll('input').forEach((input) => {
                    if (
                        !input.classList.length ||
                        input.classList.contains('invalid')
                    ) {
                        input.classList.add('shake');
                    }
                    setTimeout(() => {
                        input.classList.remove('shake');
                    }, 600);
                });

                setTimeout(() => {
                    document.querySelector('button').classList.remove('shake');
                }, 600);
            } else {
                // Iterate over inputs to retrieve values
                inputs.forEach((input) => {
                    const inputName = input.getAttribute('name');
                    const inputValue = input.value;
                    inputValues[inputName] = inputValue;
                });
                fetch('http://localhost:8080/api/user/post/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: inputValues.email,
                        password: inputValues.password,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        if (
                            data.success === false &&
                            data.status === 401 &&
                            data.message === 'Invalid Email'
                        ) {
                            const failedEmail =
                                document.querySelector('#email');
                            failedEmail.classList.add('invalid');
                            failedEmail.classList.remove('valid');
                            showError(failedEmail, data.message);
                        } else if (
                            data.success === false &&
                            data.status === 401 &&
                            data.message === 'Invalid Password'
                        ) {
                            const failedPass =
                                document.querySelector('#password');
                            failedPass.classList.add('invalid');
                            failedPass.classList.remove('valid');
                            showError(failedPass, data.message);
                        } else if (data.success === true) {
                            window.location.href = data.url;
                        }
                        document
                            .querySelector('button')
                            .classList.remove('strong');
                    });
                // animate checkmark on valid form submit
                const checkmark = document.querySelector('.checkmark');
                document
                    .querySelector('button')
                    .firstElementChild.classList.add('invisible');
                checkmark.classList.remove('hide');
                setTimeout(() => {
                    checkmark.classList.add('grow');
                }, 100);

                setTimeout(() => {
                    checkmark.classList.remove('grow');
                    checkmark.classList.add('hide');
                    document
                        .querySelector('button')
                        .firstElementChild.classList.remove('invisible');
                }, 1200);
            }
        });
}

function testStrength(password) {
    const passwordTest = passwordStrengthTest.test(password);
    if (passwordTest.strong) {
        return 'strong';
    }
    if (password.length > 7 && passwordTest.passedTests.length > 3) {
        return 'medium';
    }
    return 'weak';
}

function validateInput(input) {
    const { id, value } = input;
    input.classList.remove('valid', 'invalid');
    let valid = false;
    switch (id) {
        case 'name':
            valid = value.length >= 4 && /^\S.*/.test(value);
            break;
        case 'email':
            valid =
                value.length >= 8 &&
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
            break;
        case 'password':
            valid = testStrength(value) !== 'weak';
            break;
        case 'confirm':
            valid =
                value && value === document.querySelector('#password').value;
            break;
    }
    input.classList.add(valid ? 'valid' : 'invalid');
    return valid;
}

function showError(input, message) {
    const element = input.parentElement.firstElementChild;
    if (message) {
        element.textContent = message;
    }
    element.classList.remove('hide');
    setTimeout(() => {
        element.classList.add('fadeout');
    }, 900);

    setTimeout(() => {
        element.classList.add('hide');
        element.classList.remove('fadeout');
    }, 3200);
}
