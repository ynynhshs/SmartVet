const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const loginMessage = document.getElementById('loginMessage');

const registerForm = document.getElementById('registerForm');
const registerButton = document.getElementById('registerButton');
const registerMessage = document.getElementById('registerMessage');

const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');

const showRegisterButton = document.getElementById('showRegisterButton');
const showLoginButton = document.getElementById('showLoginButton');

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

function showLoginView() {
    registerView.hidden = true;
    loginView.hidden = false;
    registerMessage.textContent = '';
    formSide.scrollTop = 0;
}

function showRegisterView() {
    loginView.hidden = true;
    registerView.hidden = false;
    loginMessage.textContent = '';
    formSide.scrollTop = 0;
}

showRegisterButton.addEventListener('click', showRegisterView);
showLoginButton.addEventListener('click', showLoginView);

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

        saveAuthenticatedSession(data);
    } catch (error) {
        loginMessage.textContent = error.message || 'Unable to sign in.';
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Sign in';
    }
});

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