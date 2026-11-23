
const backendDot = document.getElementById('backendDot');
const backendStatus = document.getElementById('backendStatus');
const backendDetails = document.getElementById('backendDetails');
const checkConnectionButton = document.getElementById('checkConnection');

/**
 * Updates the status text and lights the backend dot; only 'connected' and
 * 'disconnected' set a colour, any other state leaves the dot neutral.
 */
function updateStatus(message, state) {
    backendStatus.textContent = message;

    backendDot.classList.remove(
        'is-connected',
        'is-disconnected'
    );

    if (state === 'connected') {
        backendDot.classList.add('is-connected');
    } else if (state === 'disconnected') {
        backendDot.classList.add('is-disconnected');
    }
}

/**
 * Calls GET /api/health and reports the result, disabling the check button
 * while the request is in flight and restoring it in a finally block.
 */
async function checkBackend() {
    checkConnectionButton.disabled = true;
    checkConnectionButton.textContent = 'Checking...';

    updateStatus('Checking backend...', 'checking');
    backendDetails.textContent =
        'Requesting a response from the SmartVet API...';

    try {
        const response = await fetch('/api/health', {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error('Unexpected health-check response.');
        }

        updateStatus('Backend connected', 'connected');

        const checkedAt = new Date(data.timestamp)
            .toLocaleTimeString();

        backendDetails.textContent =
            `${data.service} responded successfully at ${checkedAt}.`;

    } catch (error) {
        console.error('SmartVet backend check failed:', error);

        updateStatus('Backend unavailable', 'disconnected');

        backendDetails.textContent =
            'The API could not be reached. Verify that the server is running, then try again.';

    } finally {
        checkConnectionButton.disabled = false;
        checkConnectionButton.textContent = 'Check connection';
    }
}

checkConnectionButton.addEventListener('click', checkBackend);

// Run a health check when the page loads.
checkBackend();
