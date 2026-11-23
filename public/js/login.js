const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const loginMessage = document.getElementById('loginMessage');

const registerForm = document.getElementById('registerForm');
const registerButton = document.getElementById('registerButton');
const registerMessage = document.getElementById('registerMessage');

const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');

// PIN unlock and "Forgot PIN" views.
const pinView = document.getElementById('pinView');
const forgotPinView = document.getElementById('forgotPinView');

const showRegisterButton = document.getElementById('showRegisterButton');
const showLoginButton = document.getElementById('showLoginButton');
const usePasswordButton = document.getElementById('usePasswordButton');
const forgotPinButton = document.getElementById('forgotPinButton');
const switchPinAccountButton = document.getElementById('switchPinAccountButton');
const showRegisterFromPinButton = document.getElementById('showRegisterFromPinButton');
const backToPinButton = document.getElementById('backToPinButton');
const backToLoginButton = document.getElementById('backToLoginButton');

const formSide = document.querySelector('.login-form-side');

// Sessions are persisted by SmartVetSession. Visiting the login page must not
// clear an existing session, otherwise a refresh would sign the user out.

// Registration Profile Photo Elements
const registerFullName = document.getElementById('registerFullName');
const registerProfilePhoto = document.getElementById('registerProfilePhoto');
const registerAvatarPreview = document.getElementById('registerAvatarPreview');
const registerAvatarInitials = document.getElementById('registerAvatarInitials');
const registerAvatarImage = document.getElementById('registerAvatarImage');
let registerPhotoUrl = null;

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // matches the server-side multer limit

// --- PIN unlock -----------------------------------------------------------
const PIN_LENGTH = 6;

const pinBoxesElement = document.getElementById('pinBoxes');
const pinBoxes = pinBoxesElement ? SmartVetPinBoxes.init(pinBoxesElement) : null;
const pinMessage = document.getElementById('pinMessage');
const pinAccountName = document.getElementById('pinAccountName');
const pinAccountEmail = document.getElementById('pinAccountEmail');
const unlockWithPinButton = document.getElementById('unlockWithPinButton');

// The saved account is what lets the app skip the email/password form.
let pinAccount = SmartVetSession.getPinAccount();

function renderPinAccount(account) {
    pinAccount = account;

    if (pinAccountName) {
        pinAccountName.textContent = account && account.fullName
            ? account.fullName
            : 'Pet owner';
    }

    if (pinAccountEmail) {
        pinAccountEmail.textContent = account ? account.email : '';
    }
}

function currentPin() {
    return pinBoxes ? pinBoxes.getValue() : '';
}

function updateUnlockButton() {
    if (!unlockWithPinButton) return;

    unlockWithPinButton.disabled = currentPin().length !== PIN_LENGTH;
}

function setPinValue(value) {
    if (!pinBoxes) return;

    pinBoxes.setValue(value);
    pinMessage.textContent = '';
    updateUnlockButton();
}

function clearPinValue() {
    if (!pinBoxes) return;

    pinBoxes.clear();
    updateUnlockButton();
}

function updateAvatarInitials() {
    const parts = registerFullName.value.trim().split(/\s+/).filter(Boolean);
    const initials = parts
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

    registerAvatarInitials.textContent = initials || '🐾';
}

function showAvatarPhoto(url) {
    if (url) {
        registerAvatarImage.src = url;
        registerAvatarImage.hidden = false;
        registerAvatarInitials.hidden = true;
    } else {
        registerAvatarImage.hidden = true;
        registerAvatarImage.removeAttribute('src');
        registerAvatarInitials.hidden = false;
        updateAvatarInitials();
    }
}

function openPhotoPicker() {
    registerProfilePhoto.click();
}

const appViews = [
    { id: 'login', element: loginView },
    { id: 'register', element: registerView },
    { id: 'pin', element: pinView },
    { id: 'forgotPin', element: forgotPinView }
];

function showView(viewId) {
    appViews.forEach((view) => {
        if (view.element) {
            view.element.hidden = view.id !== viewId;
        }
    });

    formSide.scrollTop = 0;
    updateBackToPinLink();
}

// The email/password view keeps a way back to the PIN unlock while a saved
// PIN account still exists.
function updateBackToPinLink() {
    const wrap = document.getElementById('backToPinFromLoginWrap');

    if (!wrap) return;

    wrap.hidden = !(pinAccount && loginView && !loginView.hidden);
}

function showLoginView() {
    registerMessage.textContent = '';
    showView('login');
}

function showRegisterView() {
    loginMessage.textContent = '';
    showView('register');
}

function showPinView() {
    pinMessage.textContent = '';
    showView('pin');

    // Focus after the view is visible: focusing a box inside a hidden view
    // silently does nothing, and the phone's numeric keypad needs focus.
    clearPinValue();
}

function openForgotPinView() {
    const emailField = document.getElementById('forgotPinEmail');

    if (emailField && pinAccount) {
        emailField.value = pinAccount.email || '';
    }

    const message = document.getElementById('forgotPinMessage');
    if (message) message.textContent = '';

    if (forgotPinNew) forgotPinNew.clear();
    if (forgotPinConfirm) forgotPinConfirm.clear();

    showView('forgotPin');
}

showRegisterButton.addEventListener('click', showRegisterView);
showLoginButton.addEventListener('click', showLoginView);

if (usePasswordButton) {
    usePasswordButton.addEventListener('click', showLoginView);
}

const backToPinFromLoginButton = document.getElementById('backToPinFromLoginButton');
if (backToPinFromLoginButton) {
    backToPinFromLoginButton.addEventListener('click', showPinView);
}

if (forgotPinButton) {
    forgotPinButton.addEventListener('click', openForgotPinView);
}

if (backToPinButton) {
    backToPinButton.addEventListener('click', showPinView);
}

if (backToLoginButton) {
    backToLoginButton.addEventListener('click', showLoginView);
}

if (showRegisterFromPinButton) {
    showRegisterFromPinButton.addEventListener('click', showRegisterView);
}

if (switchPinAccountButton) {
    switchPinAccountButton.addEventListener('click', () => {
        SmartVetSession.clearPinAccount();
        pinAccount = null;
        clearPinValue();
        showLoginView();
    });
}

// Eye icon: reveal or hide the value typed into a password field.
document.querySelectorAll('.password-toggle').forEach((button) => {
    button.addEventListener('click', () => {
        const input = document.getElementById(button.dataset.target);

        if (!input) return;

        const showPassword = input.type === 'password';
        const field = input.id === 'confirmPassword' ? 'confirm password' : 'password';

        input.type = showPassword ? 'text' : 'password';
        button.classList.toggle('is-visible', showPassword);
        button.setAttribute('aria-pressed', String(showPassword));
        button.setAttribute('aria-label', `${showPassword ? 'Hide' : 'Show'} ${field}`);
        input.focus();
    });
});

// Live Preview for Registration Profile Photo
if (registerProfilePhoto) {
    registerProfilePhoto.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];

        if (registerPhotoUrl) {
            URL.revokeObjectURL(registerPhotoUrl);
            registerPhotoUrl = null;
        }

        const url = file ? URL.createObjectURL(file) : null;
        registerPhotoUrl = url;
        showAvatarPhoto(url);
    });
}

// Fall back to the owner's initials while no photo is chosen
if (registerFullName) {
    registerFullName.addEventListener('input', () => {
        if (!registerPhotoUrl) {
            updateAvatarInitials();
        }
    });
}

// The avatar itself opens the file picker (the label does too)
if (registerAvatarPreview) {
    registerAvatarPreview.addEventListener('click', openPhotoPicker);
    registerAvatarPreview.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPhotoPicker();
        }
    });
}

if (pinBoxesElement) {
    pinBoxesElement.addEventListener('pinchange', () => {
        pinMessage.textContent = '';
        updateUnlockButton();
    });

    pinBoxesElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            unlockWithPin();
        }
    });
}

// Parses JSON responses and turns HTML error pages into a readable message
async function requestJson(url, options) {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
        throw new Error((data && data.message) || 'Something went wrong. Please try again.');
    }

    return data;
}

function redirectByRole(user) {
    const ownerAppMode = new URLSearchParams(window.location.search).get('app') === 'owner';
    if (ownerAppMode && user?.role !== 'owner') {
        SmartVetSession.clear();
        throw new Error('The SmartVet mobile app is for pet-owner accounts only.');
    }

    const destinations = {
        owner: '/owner/dashboard.html',
        veterinary: '/clinic/dashboard.html',
        admin: '/admin/dashboard.html'
    };

    const destination = destinations[user?.role];

    if (!destination) {
        SmartVetSession.clear();
        throw new Error('This account has an unrecognized role.');
    }

    window.location.assign(destination);
}

function saveAuthenticatedSession(data) {
    if (!data.success || !data.accessToken || !data.user) {
        throw new Error('The server returned an invalid authentication response.');
    }

    // Persist the session so a refresh or a new tab stays signed in.
    SmartVetSession.save(data.accessToken, data.user);

    redirectByRole(data.user);
}

// Existing login process
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    loginButton.disabled = true;
    loginButton.textContent = 'Signing in...';
    loginMessage.textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
        const data = await requestJson('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Offer the fast PIN unlock on the next visit when a PIN is set.
        if (data.user && data.user.hasPin) {
            SmartVetSession.savePinAccount(data.user);
        }

        saveAuthenticatedSession(data);
    } catch (error) {
        loginMessage.textContent = error.message || 'Unable to sign in.';
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Sign in';
    }
});

// Unlock the saved owner account with its PIN.
async function unlockWithPin() {
    const email = pinAccount ? pinAccount.email : '';
    const pin = currentPin();

    if (!email) {
        pinMessage.textContent = 'No saved account was found. Sign in with your email and password.';
        return;
    }

    if (pin.length !== PIN_LENGTH) {
        pinMessage.textContent = `Enter exactly ${PIN_LENGTH} digits.`;
        return;
    }

    unlockWithPinButton.disabled = true;
    const originalLabel = unlockWithPinButton.textContent;
    unlockWithPinButton.textContent = 'Unlocking...';
    pinMessage.textContent = '';

    try {
        const data = await requestJson('/api/auth/pin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ email, pin })
        });

        // Keep the saved account current, then continue into the app.
        SmartVetSession.savePinAccount(data.user);
        saveAuthenticatedSession(data);
    } catch (error) {
        pinMessage.textContent = error.message || 'Unable to unlock with that PIN.';
        clearPinValue();
    } finally {
        unlockWithPinButton.disabled = false;
        unlockWithPinButton.textContent = originalLabel;
    }
}

if (unlockWithPinButton) {
    unlockWithPinButton.addEventListener('click', unlockWithPin);
}

// "Forgot PIN" flow: verify the email and password, then store a new PIN.
const forgotPinForm = document.getElementById('forgotPinForm');
const forgotPinEmail = document.getElementById('forgotPinEmail');
const forgotPinPassword = document.getElementById('forgotPinPassword');
const forgotPinNewBoxes = document.getElementById('forgotPinNewBoxes');
const forgotPinConfirmBoxes = document.getElementById('forgotPinConfirmBoxes');
const forgotPinNew = forgotPinNewBoxes ? SmartVetPinBoxes.init(forgotPinNewBoxes) : null;
const forgotPinConfirm = forgotPinConfirmBoxes
    ? SmartVetPinBoxes.init(forgotPinConfirmBoxes)
    : null;
const forgotPinMessage = document.getElementById('forgotPinMessage');
const resetPinButton = document.getElementById('resetPinButton');

if (forgotPinForm) {
    forgotPinForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        forgotPinMessage.textContent = '';

        const email = forgotPinEmail.value.trim();
        const password = forgotPinPassword.value;
        const pin = forgotPinNew ? forgotPinNew.getValue() : '';
        const confirmPin = forgotPinConfirm ? forgotPinConfirm.getValue() : '';

        if (!/^\d{6}$/.test(pin)) {
            forgotPinMessage.textContent = 'Your PIN must be exactly 6 digits.';
            return;
        }

        if (pin !== confirmPin) {
            forgotPinMessage.textContent = 'The PINs do not match.';
            return;
        }

        resetPinButton.disabled = true;
        const originalLabel = resetPinButton.textContent;
        resetPinButton.textContent = 'Resetting...';

        try {
            const data = await requestJson('/api/auth/pin/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ email, password, pin })
            });

            SmartVetSession.savePinAccount(data.user);
            saveAuthenticatedSession(data);
        } catch (error) {
            forgotPinMessage.textContent = error.message || 'Unable to reset your PIN.';
        } finally {
            resetPinButton.disabled = false;
            resetPinButton.textContent = originalLabel;
        }
    });
}

// NEW: Updated Owner Registration Process (Using FormData for the photo)
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    registerMessage.textContent = '';

    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        registerMessage.textContent = 'The passwords do not match.';
        return;
    }

    const photo = registerProfilePhoto.files && registerProfilePhoto.files[0];
    if (photo && photo.size > MAX_PHOTO_SIZE) {
        registerMessage.textContent = 'Profile photo must be 5 MB or smaller.';
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = 'Creating account...';

    try {
        // Use FormData to handle both text fields and the file upload
        const formData = new FormData(registerForm);

        const data = await requestJson('/api/auth/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json'
                // DO NOT set Content-Type header. The browser sets it automatically to multipart/form-data with the correct boundary.
            },
            body: formData
        });

        // Registration automatically signs the new owner in.
        saveAuthenticatedSession(data);
    } catch (error) {
        registerMessage.textContent =
            error.message || 'Unable to create your account.';
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = 'Create owner account';
    }
});

// Show the fast PIN unlock when this device already has a saved owner PIN.
if (pinAccount) {
    renderPinAccount(pinAccount);
    showPinView();
}

updateUnlockButton();