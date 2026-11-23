// Dedicated sign-in for veterinary staff.
// Owners keep using /login.html (with the PIN unlock); this page only accepts
// veterinary accounts and lands on the clinic workspace.
const clinicLoginForm = document.getElementById('clinicLoginForm');
const clinicLoginButton = document.getElementById('clinicLoginButton');
const clinicLoginMessage = document.getElementById('clinicLoginMessage');

// Eye icon: reveal or hide the password.
document.querySelectorAll('.password-toggle').forEach((button) => {
    button.addEventListener('click', () => {
        const input = document.getElementById(button.dataset.target);

        if (!input) return;

        const showPassword = input.type === 'password';

        input.type = showPassword ? 'text' : 'password';
        button.classList.toggle('is-visible', showPassword);
        button.setAttribute('aria-pressed', String(showPassword));
        button.setAttribute(
            'aria-label',
            `${showPassword ? 'Hide' : 'Show'} password`
        );
        input.focus();
    });
});

async function requestJson(url, options) {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
        ? await response.json()
        : null;

    if (!response.ok) {
        throw new Error(
            (data && data.message) || 'Something went wrong. Please try again.'
        );
    }

    return data;
}

clinicLoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    clinicLoginButton.disabled = true;
    clinicLoginButton.textContent = 'Signing in...';
    clinicLoginMessage.textContent = '';

    const email = document.getElementById('clinicEmail').value.trim();
    const password = document.getElementById('clinicPassword').value;

    try {
        const data = await requestJson('/api/auth/veterinary/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (
            !data.user ||
            !['veterinarian', 'veterinary_staff'].includes(data.user.role)
        ) {
            throw new Error(
                'This page is for veterinary staff accounts. Please use the owner portal sign in.'
            );
        }

        SmartVetSession.save(data.accessToken, data.user);
        window.location.assign('/clinic/dashboard.html');
    } catch (error) {
        clinicLoginMessage.textContent = error.message || 'Unable to sign in.';
    } finally {
        clinicLoginButton.disabled = false;
        clinicLoginButton.textContent = 'Sign in';
    }
});
