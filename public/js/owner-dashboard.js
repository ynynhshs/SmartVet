// The owner session is persisted so refreshing this page (or reopening it in
// a new tab) keeps the owner signed in. Only an explicit logout or an expired
// token clears it.
const token = SmartVetSession.getToken();

/**
 * Clears the persisted SmartVetSession token so the next page load requires a fresh sign-in.
 * Called by logout() and by apiRequest() when the token is missing or the server answers 401.
 */
function clearStoredSession() {
    SmartVetSession.clear();
}

const welcomeHeading = document.getElementById('welcomeHeading');
const dashboardMessage = document.getElementById('dashboardMessage');
const registrationForm = document.getElementById('petRegistrationForm');
const registrationMessage = document.getElementById('registrationMessage');
const registerPetButton = document.getElementById('registerPetButton');
const resetFormButton = document.getElementById('resetFormButton');
const refreshPetsButton = document.getElementById('refreshPetsButton');
const petsMessage = document.getElementById('petsMessage');
const petList = document.getElementById('petList');

// Notifications
const refreshNotificationsButton = document.getElementById('refreshNotificationsButton');
const enableNotificationsButton = document.getElementById('enableNotificationsButton');
const pushStatus = document.getElementById('pushStatus');
const notificationsSummary = document.getElementById('notificationsSummary');
const ownerNotificationList = document.getElementById('ownerNotificationList');
const ownerVaccinationsList = document.getElementById('ownerVaccinationsList');
const ownerVaccinationsMessage = document.getElementById('ownerVaccinationsMessage');
const refreshOwnerVaccinationsButton = document.getElementById('refreshOwnerVaccinationsButton');

// Owner Feeding History
const refreshOwnerFeedingEventsButton = document.getElementById('refreshOwnerFeedingEventsButton');
const ownerFeedingEventsSummary = document.getElementById('ownerFeedingEventsSummary');
const ownerFeedingEventList = document.getElementById('ownerFeedingEventList');

const ownerFeedingPetFilter = document.getElementById('ownerFeedingPetFilter');
const ownerFeedingStatusFilter = document.getElementById('ownerFeedingStatusFilter');
const applyOwnerFeedingFiltersButton = document.getElementById('applyOwnerFeedingFiltersButton');


// Owner Activity Monitoring
const refreshOwnerActivityButton = document.getElementById(
    'refreshOwnerActivityButton'
);
const ownerActivitySummary = document.getElementById(
    'ownerActivitySummary'
);
const ownerActivityRecordsList = document.getElementById(
    'ownerActivityRecordsList'
);
const ownerActivityPetFilter = document.getElementById(
    'ownerActivityPetFilter'
);
const ownerActivityTypeFilter = document.getElementById(
    'ownerActivityTypeFilter'
);
const ownerActivityFromFilter = document.getElementById(
    'ownerActivityFromFilter'
);
const ownerActivityLoadMoreButton = document.getElementById(
    'ownerActivityLoadMoreButton'
);

// Sidebar counts & Overview stats
const sidebarPetsCount = document.getElementById('sidebarPetsCount');
const sidebarUnreadCount = document.getElementById('sidebarUnreadCount');
const overviewPetsCount = document.getElementById('overviewPetsCount');
const overviewUnreadCount = document.getElementById('overviewUnreadCount');

let ownerVerified = false;


// Pet photo selection and local preview.
const petPhotoInput = document.getElementById('petPhoto');
const petPhotoPreviewContainer = document.getElementById('petPhotoPreviewContainer');
const petPhotoPreview = document.getElementById('petPhotoPreview');
const petPhotoFileName = document.getElementById('petPhotoFileName');
const removePetPhotoButton = document.getElementById('removePetPhotoButton');
const petUploadIcon = document.getElementById('petUploadIcon');
const petUploadText = document.getElementById('petUploadText');
const uploadStatusBar = document.getElementById('uploadStatusBar');
let petPhotoPreviewUrl = null;

/**
 * Revokes the pet photo object URL and resets the upload widget (input value, preview, file name, status bar) to its empty state.
 */
function clearPetPhotoPreview() {
    if (petPhotoPreviewUrl) {
        URL.revokeObjectURL(petPhotoPreviewUrl);
        petPhotoPreviewUrl = null;
    }
    if (petPhotoInput) petPhotoInput.value = '';
    if (petPhotoPreview) petPhotoPreview.removeAttribute('src');
    if (petPhotoFileName) petPhotoFileName.textContent = 'No file chosen';
    
    if (petPhotoPreviewContainer) petPhotoPreviewContainer.hidden = true;
    if (removePetPhotoButton) removePetPhotoButton.hidden = true;
    
    // Reset the UI for the new upload box
    if (uploadStatusBar) uploadStatusBar.style.display = 'none';
    if (petUploadIcon) petUploadIcon.style.display = 'flex';
    if (petUploadText) petUploadText.style.display = 'flex';
}

if (petPhotoInput && petPhotoPreviewContainer && petPhotoPreview && petPhotoFileName) {
    petPhotoInput.addEventListener('change', () => {
        const file = petPhotoInput.files && petPhotoInput.files[0];
        if (petPhotoPreviewUrl) {
            URL.revokeObjectURL(petPhotoPreviewUrl);
            petPhotoPreviewUrl = null;
        }
        petPhotoPreview.removeAttribute('src');
        petPhotoFileName.textContent = 'No file chosen';
        petPhotoPreviewContainer.hidden = true;
        
        if (removePetPhotoButton) removePetPhotoButton.hidden = true;

        if (!file) {
            if (uploadStatusBar) uploadStatusBar.style.display = 'none';
            if (petUploadIcon) petUploadIcon.style.display = 'flex';
            if (petUploadText) petUploadText.style.display = 'flex';
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            petPhotoInput.value = '';
            showMessage(registrationMessage, 'Choose a JPG, PNG, or WebP image.', 'error');
            if (uploadStatusBar) uploadStatusBar.style.display = 'none';
            if (petUploadIcon) petUploadIcon.style.display = 'flex';
            if (petUploadText) petUploadText.style.display = 'flex';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            petPhotoInput.value = '';
            showMessage(registrationMessage, 'The pet photo must be 5 MB or smaller.', 'error');
            if (uploadStatusBar) uploadStatusBar.style.display = 'none';
            if (petUploadIcon) petUploadIcon.style.display = 'flex';
            if (petUploadText) petUploadText.style.display = 'flex';
            return;
        }

        petPhotoPreviewUrl = URL.createObjectURL(file);
        petPhotoPreview.src = petPhotoPreviewUrl;
        petPhotoFileName.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        
        // Show the preview and status bar, hide the icon
        petPhotoPreviewContainer.hidden = false;
        if (removePetPhotoButton) removePetPhotoButton.hidden = false;
        if (uploadStatusBar) uploadStatusBar.style.display = 'flex';
        if (petUploadIcon) petUploadIcon.style.display = 'none';
        if (petUploadText) petUploadText.style.display = 'none';
        
        showMessage(registrationMessage, '');
    });

    if (removePetPhotoButton) {
        removePetPhotoButton.addEventListener('click', () => {
            clearPetPhotoPreview();
            showMessage(registrationMessage, 'Pet photo removed.');
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener('reset', () => {
            clearPetPhotoPreview();
        });
    }
}


// Sidebar & View Navigation Logic
const SETTINGS_VIEWS = ['account', 'theme', 'pin'];

/**
 * Returns true when the desktop sidebar shell carries the `sidebar-collapsed` class.
 * Used to decide whether the Settings group toggle expands its sub-menu or jumps straight to a page.
 */
function isSidebarCollapsed() {
    const shell = document.querySelector('.owner-shell');
    return Boolean(shell && shell.classList.contains('sidebar-collapsed'));
}

/**
 * Activates the nav item and `.owner-view` panel matching `targetView` while hiding every other view.
 * Also keeps the Settings group expanded whenever one of its own sub-pages is open.
 */
function switchView(targetView) {
    const views = document.querySelectorAll('.owner-view');

    // Both top-level items and Settings sub-items carry data-view.
    document.querySelectorAll('[data-view]').forEach((item) => {
        const isActive = item.dataset.view === targetView;

        item.classList.toggle('active', isActive);

        if (isActive) {
            item.setAttribute('aria-current', 'page');
        } else {
            item.removeAttribute('aria-current');
        }
    });

    views.forEach((view) => {
        if (view.dataset.page === targetView) {
            view.classList.add('is-active');
            view.hidden = false;
        } else {
            view.classList.remove('is-active');
            view.hidden = true;
        }
    });

    // Keep the Settings group expanded while one of its pages is open.
    const group = document.querySelector('.nav-group[data-group="settings"]');

    if (group) {
        const isSettingsView = SETTINGS_VIEWS.includes(targetView);
        const toggle = group.querySelector('[data-group-toggle]');
        const submenu = group.querySelector('[data-submenu]');

        group.classList.toggle('is-open', isSettingsView);
        group.classList.toggle('is-current', isSettingsView);

        if (toggle) {
            toggle.setAttribute('aria-expanded', String(isSettingsView));
        }

        if (submenu) {
            submenu.hidden = !isSettingsView;
        }
    }
}

document.querySelectorAll('.nav-item[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
        switchView(button.dataset.view);
    });
});

document.querySelectorAll('.nav-subitem[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
        switchView(button.dataset.view);
    });
});

// The Settings group expands its sub-menu. On a collapsed desktop sidebar the
// sub-menu has no room, so the toggle jumps straight to the first settings page.
const settingsGroupToggle = document.querySelector('[data-group-toggle="settings"]');

if (settingsGroupToggle) {
    settingsGroupToggle.addEventListener('click', () => {
        const group = settingsGroupToggle.closest('.nav-group');
        const submenu = group ? group.querySelector('[data-submenu]') : null;

        if (isSidebarCollapsed()) {
            switchView('account');
            return;
        }

        const isOpen = Boolean(group && group.classList.toggle('is-open'));

        settingsGroupToggle.setAttribute('aria-expanded', String(isOpen));

        if (submenu) {
            submenu.hidden = !isOpen;
        }
    });
}

document.querySelectorAll('.quick-action').forEach((button) => {
    button.addEventListener('click', () => {
        switchView(button.dataset.viewTarget);
    });
});

const ownerVaccinationsNavigationButton = document.querySelector(
    '.nav-item[data-view="vaccinations"]'
);
if (ownerVaccinationsNavigationButton) {
    ownerVaccinationsNavigationButton.addEventListener(
        'click',
        loadOwnerVaccinations
    );
}

if (refreshOwnerVaccinationsButton) {
    refreshOwnerVaccinationsButton.addEventListener(
        'click',
        loadOwnerVaccinations
    );
}

/**
 * Writes `message` into `element` and swaps its `error`/`success` modifier classes, adding `type` when given.
 * Silently does nothing when `element` is null.
 */
function showMessage(element, message, type = '') {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('error', 'success');
    if (type) element.classList.add(type);
}

/**
 * Formats a vaccination date for display, returning 'Not scheduled' for empty values and 'Not available' for unparseable dates.
 */
function formatOwnerVaccinationDate(value) {
    if (!value) return 'Not scheduled';

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? 'Not available'
        : date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
}

/**
 * Derives the follow-up badge from `record.nextDueDate` by comparing its date part with today.
 * Returns a label plus CSS class: 'no-follow-up', 'overdue', 'due-soon' (within 30 days) or 'upcoming'.
 */
function getOwnerVaccinationFollowUp(record) {
    if (!record.nextDueDate) {
        return { label: 'No follow-up scheduled', className: 'no-follow-up' };
    }

    const dueDate = new Date(record.nextDueDate).toISOString().slice(0, 10);
    const todayDate = new Date();
    const today = [
        todayDate.getFullYear(),
        String(todayDate.getMonth() + 1).padStart(2, '0'),
        String(todayDate.getDate()).padStart(2, '0')
    ].join('-');

    if (dueDate < today) return { label: 'Overdue', className: 'overdue' };

    const daysUntilDue = Math.ceil(
        (new Date(`${dueDate}T00:00:00`) - new Date(`${today}T00:00:00`)) /
        (24 * 60 * 60 * 1000)
    );

    return daysUntilDue <= 30
        ? { label: 'Due soon', className: 'due-soon' }
        : { label: 'Upcoming', className: 'upcoming' };
}

/**
 * Opens a new window and writes a self-contained, HTML-escaped vaccination certificate that triggers print on load.
 * Shows an error message instead when the pop-up is blocked.
 */
function printOwnerVaccinationCertificate(record) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        showMessage(
            ownerVaccinationsMessage,
            'Allow pop-ups to print the vaccination certificate.',
            'error'
        );
        return;
    }

    printWindow.opener = null;
    const escapeHtml = (value) => String(value || 'Not provided')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    const pet = record.pet || {};
    const title = `${pet.name || 'Pet'} - ${record.vaccineName || 'Vaccination'}`;

    printWindow.document.write(`<!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${escapeHtml(title)} vaccination certificate</title>
            <style>
                * { box-sizing: border-box; }
                body { margin: 0; padding: 40px; color: #18324b; font: 16px/1.5 Arial, sans-serif; }
                main { max-width: 760px; margin: 0 auto; padding: 42px; border: 2px solid #2389e0; border-radius: 18px; }
                header { padding-bottom: 22px; border-bottom: 1px solid #d5e2ef; }
                .brand { color: #2389e0; font-size: 13px; font-weight: 700; letter-spacing: 2px; }
                h1 { margin: 8px 0; font-size: 30px; }
                .intro, footer { color: #557087; }
                dl { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 28px 0; }
                dl div { padding: 12px; background: #f2f7fb; border-radius: 10px; }
                dt { color: #557087; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
                dd { margin: 5px 0 0; overflow-wrap: anywhere; font-weight: 600; }
                footer { padding-top: 18px; border-top: 1px solid #d5e2ef; font-size: 12px; }
                @media print { body { padding: 0; } main { border: 2px solid #2389e0; } }
                @media (max-width: 560px) { body { padding: 12px; } main { padding: 22px; } dl { grid-template-columns: 1fr; } }
            </style>
        </head>
        <body>
            <main>
                <header>
                    <div class="brand">SMARTVET · PET HEALTH RECORD</div>
                    <h1>Vaccination Certificate</h1>
                    <p class="intro">This certificate documents a vaccination recorded by the veterinary clinic.</p>
                </header>
                <dl>
                    <div><dt>Pet</dt><dd>${escapeHtml(pet.name)}</dd></div>
                    <div><dt>Official Pet ID</dt><dd>${escapeHtml(pet.petCode)}</dd></div>
                    <div><dt>Species</dt><dd>${escapeHtml(pet.species)}</dd></div>
                    <div><dt>Vaccine</dt><dd>${escapeHtml(record.vaccineName)}</dd></div>
                    <div><dt>Date administered</dt><dd>${escapeHtml(formatOwnerVaccinationDate(record.administeredDate))}</dd></div>
                    <div><dt>Next due date</dt><dd>${escapeHtml(formatOwnerVaccinationDate(record.nextDueDate))}</dd></div>
                    <div><dt>Manufacturer</dt><dd>${escapeHtml(record.manufacturer)}</dd></div>
                    <div><dt>Batch / lot</dt><dd>${escapeHtml(record.batchNumber)}</dd></div>
                    <div><dt>Dosage</dt><dd>${escapeHtml(record.dosage)}</dd></div>
                    <div><dt>Veterinary staff</dt><dd>${escapeHtml(record.administeredBy)}</dd></div>
                </dl>
                <footer>Generated from the SmartVet owner portal. For corrections or medical advice, contact your veterinary clinic.</footer>
            </main>
            <script>window.addEventListener('load', () => window.print(), { once: true });</script>
        </body>
        </html>`);
    printWindow.document.close();
}

/**
 * Fetches `/api/owner/vaccinations` and renders one follow-up card per record, showing a skeleton loader while in flight.
 * Re-enables the refresh button in `finally`; an empty list renders an empty-state message.
 */
async function loadOwnerVaccinations() {
    if (!ownerVaccinationsList) return;

    refreshOwnerVaccinationsButton.disabled = true;
    showMessage(ownerVaccinationsMessage, 'Loading your vaccination records...');
    ownerVaccinationsList.replaceChildren(createSkeletonLoader(2));

    try {
        const data = await apiRequest('/api/owner/vaccinations');
        const records = Array.isArray(data.vaccinations)
            ? data.vaccinations
            : [];
        ownerVaccinationsList.replaceChildren();

        if (records.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent =
                'No vaccination records are available for your approved pets yet.';
            ownerVaccinationsList.appendChild(empty);
            showMessage(ownerVaccinationsMessage, 'No vaccination follow-ups found.');
            return;
        }

        records.forEach((record) => {
            const card = document.createElement('article');
            card.className = 'owner-follow-up-card';

            const pet = record.pet || {};
            const heading = document.createElement('h2');
            heading.textContent = `${pet.name || 'Your pet'} · ${record.vaccineName || 'Vaccination'}`;

            const petInfo = document.createElement('p');
            petInfo.className = 'muted';
            petInfo.textContent = [
                pet.species || 'Pet',
                pet.petCode ? `ID ${pet.petCode}` : ''
            ].filter(Boolean).join(' · ');

            const followUp = getOwnerVaccinationFollowUp(record);
            const status = document.createElement('span');
            status.className = `owner-follow-up-status ${followUp.className}`;
            status.textContent = followUp.label;

            const dates = document.createElement('div');
            dates.className = 'owner-follow-up-dates';
            const administered = document.createElement('p');
            administered.textContent =
                `Administered: ${formatOwnerVaccinationDate(record.administeredDate)}`;
            const due = document.createElement('p');
            due.textContent = `Next due: ${formatOwnerVaccinationDate(record.nextDueDate)}`;

            const printButton = document.createElement('button');
            printButton.type = 'button';
            printButton.className = 'secondary-button';
            printButton.textContent = 'Print certificate';
            printButton.addEventListener('click', () =>
                printOwnerVaccinationCertificate(record)
            );

            dates.append(administered, due);
            card.append(heading, petInfo, status, dates, printButton);
            ownerVaccinationsList.appendChild(card);
        });

        showMessage(
            ownerVaccinationsMessage,
            `${records.length} vaccination record(s) loaded.`,
            'success'
        );
    } catch (error) {
        ownerVaccinationsList.replaceChildren();
        const message = document.createElement('p');
        message.className = 'message error';
        message.textContent =
            error.message || 'Unable to load your vaccination records.';
        ownerVaccinationsList.appendChild(message);
        showMessage(
            ownerVaccinationsMessage,
            error.message || 'Unable to load your vaccination records.',
            'error'
        );
    } finally {
        refreshOwnerVaccinationsButton.disabled = false;
    }
}

// --- NEW SKELETON LOADER FUNCTION ---
/**
 * Builds and returns a `skeleton-grid` container holding `count` placeholder cards for loading states.
 */
function createSkeletonLoader(count = 3) {
    const container = document.createElement('div');
    container.className = 'skeleton-grid';

    for (let i = 0; i < count; i++) {
        const card = document.createElement('div');
        card.className = 'sv-skeleton-card';
        
        const title = document.createElement('div');
        title.className = 'sv-skeleton sv-skeleton-title';
        
        const desc = document.createElement('div');
        desc.className = 'sv-skeleton sv-skeleton-desc';
        
        card.appendChild(title);
        card.appendChild(desc);
        container.appendChild(card);
    }

    return container;
}

/**
 * Clears the stored session and redirects the browser to `/login.html`.
 */
function logout() {
    clearStoredSession();
    window.location.assign('/login.html');
}

document.getElementById('logoutButton').addEventListener('click', logout);

/**
 * Fetch wrapper that injects the bearer token, JSON-encodes non-FormData bodies and throws on non-OK responses or `success: false`.
 * Logs out and throws when the token is missing or the server answers 401.
 */
async function apiRequest(url, options = {}) {
    if (!token) {
        logout();
        throw new Error('Please sign in again.');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.body && !(options.body instanceof FormData)
                ? { 'Content-Type': 'application/json' }
                : {}),
            ...options.headers
        }
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
        logout();
        throw new Error('Your session has expired. Please sign in again.');
    }

    if (!response.ok || data.success === false) {
        throw new Error(data.message || `Request failed (${response.status}).`);
    }

    return data;
}

/**
 * Maps a registration status key to its human-readable label, falling back to 'Unknown status'.
 */
function readableStatus(status) {
    const labels = {
        pending: 'Pending veterinary review',
        approved: 'Approved',
        needs_verification: 'Needs additional verification'
    };
    return labels[status] || 'Unknown status';
}

/**
 * Builds the flip-card DOM for a pet (photo, detail grid, vaccination card and QR section) and wires the click-to-flip behaviour.
 * The vaccination card and QR controls are only added for approved pets that have a `petCode`, and the vaccination card loads lazily on first click.
 */
function createPetCard(pet) {
    /**
     * Formats a vaccination date inside a pet card, returning 'Not recorded' when empty and 'Not available' for invalid dates.
     */
    function formatVaccinationDate(value) {
        if (!value) return 'Not recorded';
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? 'Not available'
            : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

        /**
         * Appends a label/value paragraph to a vaccination card, adding the `vaccine-date-highlight` class for real date values.
         * The label is written with `innerHTML` while the value uses `textContent`.
         */
        function addVaccinationDetail(parent, label, value, isDate = false) {
        const paragraph = document.createElement('p');
        
        const labelSpan = document.createElement('span');
        labelSpan.innerHTML = `<strong>${label}:</strong>`;
        
        const valueSpan = document.createElement('span');
        if (isDate && value && value !== 'Not recorded' && value !== 'Not available') {
            valueSpan.className = 'vaccine-date-highlight';
        }
        valueSpan.textContent = value || 'Not provided';
        
        paragraph.appendChild(labelSpan);
        paragraph.appendChild(valueSpan);
        parent.appendChild(paragraph);
    }
    /**
     * Fetches `/api/owner/pets/:id/vaccinations` and fills `container` with the digital vaccination card, showing a skeleton loader first.
     * Returns true on success and false after rendering an inline error message.
     */
    async function loadOwnerVaccinationCard(petId, container) {
        // Replaced text loader with Skeleton Loader
        container.replaceChildren(createSkeletonLoader(1));

        try {
            const data = await apiRequest(`/api/owner/pets/${encodeURIComponent(petId)}/vaccinations`);
            container.replaceChildren();

            const petInfo = data.pet || {};
            const heading = document.createElement('h4');
            heading.textContent = 'Digital Vaccination Card';
            container.appendChild(heading);

            addVaccinationDetail(container, 'Pet name', petInfo.name);
            addVaccinationDetail(container, 'Official Pet ID', petInfo.petCode);
            addVaccinationDetail(container, 'Species', petInfo.species);
            addVaccinationDetail(container, 'Registration status', readableStatus(petInfo.registrationStatus));

            const records = Array.isArray(data.vaccinations) ? data.vaccinations : [];
            const historyHeading = document.createElement('h4');
            historyHeading.textContent = 'Vaccination History';
            container.appendChild(historyHeading);

            if (records.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'empty-state';
                empty.textContent = 'No vaccination records have been entered by veterinary staff yet.';
                container.appendChild(empty);
                return true;
            }

            records.forEach((record) => {
                const entry = document.createElement('article');
                entry.className = 'owner-vaccination-entry';
                const vaccineHeading = document.createElement('h5');
                vaccineHeading.textContent = record.vaccineName || 'Unnamed vaccine';
                entry.appendChild(vaccineHeading);

                                addVaccinationDetail(entry, 'Date administered', formatVaccinationDate(record.administeredDate), true);
                addVaccinationDetail(entry, 'Next due date', formatVaccinationDate(record.nextDueDate), true);
                
                // Leave the rest exactly as they are (without the 'true'):
                addVaccinationDetail(entry, 'Manufacturer', record.manufacturer);
                addVaccinationDetail(entry, 'Batch / lot number', record.batchNumber);
                addVaccinationDetail(entry, 'Dosage', record.dosage);
                addVaccinationDetail(entry, 'Recorded by', record.administeredBy);
                if (record.notes) addVaccinationDetail(entry, 'Notes', record.notes);

                container.appendChild(entry);
            });

            return true;
        } catch (error) {
            container.replaceChildren();
            const message = document.createElement('p');
            message.className = 'message error';
            message.textContent = error.message || 'Unable to load vaccination card.';
            container.appendChild(message);
            return false;
        }
    }

    // --- BUILD THE 3D FLIP CARD STRUCTURE ---
    const card = document.createElement('div');
    card.className = 'flip-card';

    const cardInner = document.createElement('div');
    cardInner.className = 'flip-card-inner';

    const cardFront = document.createElement('div');
    cardFront.className = 'flip-card-front';

    const cardBack = document.createElement('div');
    cardBack.className = 'flip-card-back';

    // --- FRONT OF THE CARD ---
    if (pet.hasPhoto && pet.id) {
        const photo = document.createElement('img');
        photo.className = 'registered-pet-photo';
        photo.alt = `${pet.name || 'Pet'} photo`;
        photo.loading = 'lazy';

        fetch(`/api/owner/pets/${encodeURIComponent(pet.id)}/photo`, {
            headers: {
                Accept: 'image/jpeg, image/png, image/webp',
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Unable to load pet photo.');
                return response.blob();
            })
            .then(blob => {
                const imageUrl = URL.createObjectURL(blob);
                photo.src = imageUrl;
                photo.addEventListener('load', () => URL.revokeObjectURL(imageUrl), { once: true });
            })
            .catch(() => {
                photo.alt = 'Pet photo unavailable';
                photo.classList.add('pet-photo-unavailable');
            });

        cardFront.appendChild(photo);
    }

    const name = document.createElement('h3');
    name.textContent = pet.name || 'Unnamed pet';
    cardFront.appendChild(name);

    const status = document.createElement('span');
    status.className = `pet-status ${pet.registrationStatus || ''}`;
    status.textContent = readableStatus(pet.registrationStatus);
    cardFront.appendChild(status);

    const tapHint = document.createElement('p');
    tapHint.className = 'muted';
    tapHint.style.fontSize = '0.8rem';
    tapHint.style.marginTop = '15px';
    tapHint.textContent = 'Tap to view details';
    cardFront.appendChild(tapHint);

    // --- BACK OF THE CARD ---
    const backTitle = document.createElement('h3');
    backTitle.textContent = pet.name || 'Unnamed pet';
    cardBack.appendChild(backTitle);

    const detailsGrid = document.createElement('div');
    detailsGrid.className = 'pet-details-grid';

    /**
     * Appends one label/value row to the pet details grid, skipping the row entirely when `value` is falsy.
     */
    function addDetailItem(label, value) {
        if (!value) return;
        const item = document.createElement('div');
        item.className = 'detail-item';
        
        const labelSpan = document.createElement('span');
        labelSpan.className = 'detail-label';
        labelSpan.textContent = label;
        
        const valueSpan = document.createElement('span');
        valueSpan.className = 'detail-value';
        valueSpan.textContent = value;
        
        item.appendChild(labelSpan);
        item.appendChild(valueSpan);
        detailsGrid.appendChild(item);
    }

    addDetailItem('Species', pet.species);
    addDetailItem('Breed', pet.breed);
    addDetailItem('Sex', pet.sex);
    addDetailItem('Color', pet.color);
    
    if (pet.dateOfBirth) {
        addDetailItem('Date of Birth', pet.dateOfBirth.slice(0, 10));
    }

    cardBack.appendChild(detailsGrid);

    if (pet.registrationStatus === 'approved') {
        const petCodeWrapper = document.createElement('div');
        petCodeWrapper.className = 'pet-id-wrapper';

        const petCodeLabel = document.createElement('span');
        petCodeLabel.className = 'detail-label';
        petCodeLabel.textContent = 'Official Pet ID';

        const petCodeValue = document.createElement('strong');
        petCodeValue.className = 'pet-id-value';
        petCodeValue.textContent = pet.petCode || 'Pending';

        petCodeWrapper.appendChild(petCodeLabel);
        petCodeWrapper.appendChild(petCodeValue);
        cardBack.appendChild(petCodeWrapper);

        const vaccinationButton = document.createElement('button');
        vaccinationButton.type = 'button';
        vaccinationButton.className = 'secondary-button vaccination-toggle';
        vaccinationButton.textContent = 'View Digital Vaccination Card';
        vaccinationButton.style.marginTop = '10px';

        const vaccinationContainer = document.createElement('section');
        vaccinationContainer.className = 'owner-vaccination-card';
        vaccinationContainer.hidden = true;

        vaccinationButton.addEventListener('click', async (e) => {
            e.stopPropagation(); 
            if (!vaccinationContainer.hidden) {
                vaccinationContainer.hidden = true;
                vaccinationButton.textContent = 'View Digital Vaccination Card';
                return;
            }
            vaccinationContainer.hidden = false;
            vaccinationButton.textContent = 'Hide Digital Vaccination Card';

            if (vaccinationContainer.dataset.loaded === 'true') return;

            vaccinationButton.disabled = true;
            const loaded = await loadOwnerVaccinationCard(pet.id, vaccinationContainer);
            if (loaded) vaccinationContainer.dataset.loaded = 'true';
            vaccinationButton.disabled = false;
        });

        cardBack.appendChild(vaccinationButton);
        cardBack.appendChild(vaccinationContainer);

        if (pet.petCode && pet.id) {
            const qrSection = document.createElement('div');
            qrSection.className = 'pet-qr-section';

            const qrHeading = document.createElement('h4');
            qrHeading.textContent = 'Pet Identification QR Code';
            qrSection.appendChild(qrHeading);

            const qrMessage = document.createElement('p');
            qrMessage.className = 'message';
            qrMessage.textContent = 'Loading QR code...';
            qrSection.appendChild(qrMessage);

            const qrImage = document.createElement('img');
            qrImage.alt = `QR code for ${pet.name}`;
            qrImage.hidden = true;
            qrSection.appendChild(qrImage);

            const downloadButton = document.createElement('button');
            downloadButton.type = 'button';
            downloadButton.className = 'secondary-button';
            downloadButton.textContent = 'Download QR Code';
            downloadButton.disabled = true;
            qrSection.appendChild(downloadButton);

            downloadButton.addEventListener('click', (e) => {
                e.stopPropagation(); 
                if (!qrImage.src || qrImage.hidden) return;
                const link = document.createElement('a');
                link.href = qrImage.src;
                link.download = `${pet.petCode}-QR.png`;
                document.body.appendChild(link);
                link.click();
                link.remove();
            });

            cardBack.appendChild(qrSection);

            apiRequest(`/api/owner/pets/${encodeURIComponent(pet.id)}/qr-image`)
                .then((data) => {
                    if (!data.qrCodeImage) throw new Error('No QR image returned.');
                    qrImage.src = data.qrCodeImage;
                    qrImage.hidden = false;
                    downloadButton.disabled = false;
                    showMessage(qrMessage, 'QR code ready.', 'success');
                })
                .catch((error) => {
                    showMessage(qrMessage, error.message || 'Unable to load QR code.', 'error');
                });
        }
    }

    // --- ASSEMBLE AND ADD FLIP LOGIC ---
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('img[alt*="QR"]')) {
            return; 
        }
        card.classList.toggle('is-flipped');
    });

    return card;
}

/**
 * Builds a notification card with read/unread styling, an optional high-priority badge and a "Mark as Read" button for unread items only.
 */
function createNotificationCard(notification) {
    const card = document.createElement('article');
    card.className = notification.read ? 'owner-notification-card is-read' : 'owner-notification-card is-unread';

    const heading = document.createElement('h3');
    heading.textContent = notification.title || 'Notification';
    card.appendChild(heading);

    const message = document.createElement('p');
    message.textContent = notification.message || '';
    card.appendChild(message);

    if (notification.priority === 'high') {
        const priority = document.createElement('span');
        priority.className = 'notification-priority high';
        priority.textContent = 'High priority';
        card.appendChild(priority);
    }

    if (!notification.read) {
        const markReadButton = document.createElement('button');
        markReadButton.type = 'button';
        markReadButton.className = 'secondary-button';
        markReadButton.textContent = 'Mark as Read';
        markReadButton.addEventListener('click', () => {
            markNotificationAsRead(notification.id, markReadButton);
        });
        card.appendChild(markReadButton);
    }

    return card;
}


/**
 * Formats a feeding timestamp with `toLocaleString()`, returning 'Not recorded' or 'Not available' for empty or invalid values.
 */
function formatOwnerFeedingTimestamp(value) {
    if (!value) {
        return 'Not recorded';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    return date.toLocaleString();
}


/**
 * Builds a feeding event card with a status-specific outcome message and a `feeding-status-*` class derived from the status.
 */
function createOwnerFeedingEventCard(event) {
    const card = document.createElement('article');
    card.className = 'owner-feeding-event-card';

    const petName = event.pet?.name || 'Unknown pet';

    const heading = document.createElement('h3');
    heading.textContent = petName;
    card.appendChild(heading);

    /**
     * Appends a plain "label: value" paragraph to a feeding event card.
     */
    function addDetail(label, value) {
        const detail = document.createElement('p');
        detail.textContent = `${label}: ${value}`;
        card.appendChild(detail);
    }

    const statusLabels = {
        running: 'In progress',
        completed: 'Completed',
        failed: 'Failed',
        cancelled: 'Cancelled'
    };

    addDetail(
        'Status',
        statusLabels[event.status] || event.status || 'Unknown'
    );

    const statusMessages = {
        running: 'Feeding has started. The final outcome has not been recorded yet.',
        completed:
            event.dispensedGrams !== undefined &&
            event.dispensedGrams !== null
                ? `Feeding was marked completed. The reported dispensed amount is ${event.dispensedGrams} g.`
                : 'Feeding was marked completed, but the dispensed amount was not reported.',
        failed: event.failureReason
            ? `Feeding failed. Reason: ${event.failureReason}`
            : 'This feeding attempt failed. No failure reason was recorded.',
        cancelled: event.failureReason
            ? `Feeding was cancelled. Reason: ${event.failureReason}`
            : 'This feeding attempt was cancelled. No cancellation reason was recorded.'
    };

    const outcome = document.createElement('p');
    outcome.className = 'feeding-outcome-message';
    outcome.textContent =
        statusMessages[event.status] ||
        'Additional feeding-result details are unavailable.';
    card.appendChild(outcome);

    addDetail(
        'Feeding type',
        event.source === 'manual' ? 'Manual' : 'Scheduled'
    );

    addDetail('Requested food', `${event.requestedGrams} g`);

    addDetail(
        'Dispensed food',
        event.dispensedGrams !== undefined &&
        event.dispensedGrams !== null
            ? `${event.dispensedGrams} g`
            : 'Not reported'
    );

    addDetail('Started', formatOwnerFeedingTimestamp(event.startedAt));
    addDetail('Completed', formatOwnerFeedingTimestamp(event.completedAt));

    const statusClass = String(event.status || 'unknown')
        .toLowerCase()
        .replace(/[^a-z-]/g, '');

    card.classList.add(`feeding-status-${statusClass}`);

    return card;
}


/**
 * Fills the feeding pet filter from `/api/owner/pets`, guarded by a `data-loaded` flag so it never fetches twice.
 * Failures are only logged to the console.
 */
async function populateOwnerFeedingPetFilter() {
    if (
        !ownerFeedingPetFilter ||
        ownerFeedingPetFilter.dataset.loaded === 'true'
    ) {
        return;
    }

    try {
        const data = await apiRequest('/api/owner/pets');
        const pets = Array.isArray(data.pets) ? data.pets : [];

        pets.forEach((pet) => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = pet.species
                ? `${pet.name} (${pet.species})`
                : pet.name;

            ownerFeedingPetFilter.appendChild(option);
        });

        ownerFeedingPetFilter.dataset.loaded = 'true';
    } catch (error) {
        console.error('Unable to load pets for feeding filters:', error);
    }
}

// Owner Activity Monitoring: load activity records for the owner's pets.
// Records arrive newest-first in pages; "Load more" appends the next page.
const OWNER_ACTIVITY_LIMIT = 50;
let ownerActivitySkip = 0;
let ownerActivityTotal = 0;

/**
 * Fetches one page (50 records) of `/api/owner/activity-records` using the pet, type and from filters.
 * `options.append` advances the skip offset and appends instead of replacing; the Load more button reflects the shown/total counts.
 */
async function loadOwnerActivityRecords(options = {}) {
    if (!ownerActivityRecordsList) return;

    const append = Boolean(options.append);

    ownerActivitySkip = append
        ? ownerActivitySkip + OWNER_ACTIVITY_LIMIT
        : 0;

    ownerActivityRecordsList.setAttribute('aria-busy', 'true');

    if (refreshOwnerActivityButton) {
        refreshOwnerActivityButton.disabled = true;
    }

    if (ownerActivityLoadMoreButton) {
        ownerActivityLoadMoreButton.disabled = true;
    }

    if (ownerActivitySummary) {
        showMessage(
            ownerActivitySummary,
            append
                ? 'Loading more activity records...'
                : 'Loading your pets\' activity records...'
        );
    }

    // Replaced text loader with Skeleton Loader
    if (!append) {
        ownerActivityRecordsList.replaceChildren(createSkeletonLoader(2));
    }

    try {
        const query = new URLSearchParams();

        if (ownerActivityPetFilter?.value) {
            query.set('petId', ownerActivityPetFilter.value);
        }

        if (ownerActivityTypeFilter?.value) {
            query.set('activity', ownerActivityTypeFilter.value);
        }

        if (ownerActivityFromFilter?.value) {
            query.set('from', ownerActivityFromFilter.value);
        }

        query.set('limit', String(OWNER_ACTIVITY_LIMIT));
        query.set('skip', String(ownerActivitySkip));

        const queryString = query.toString();
        const url = queryString
            ? `/api/owner/activity-records?${queryString}`
            : '/api/owner/activity-records';

        const data = await apiRequest(url);
        const records = Array.isArray(data.records) ? data.records : [];
        ownerActivityTotal = Number(data.total) || 0;

        if (!append) {
            ownerActivityRecordsList.replaceChildren();
        }

        if (records.length === 0 && !append) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'muted';
            emptyMessage.textContent =
                'No activity records were found for the selected filters.';
            ownerActivityRecordsList.appendChild(emptyMessage);

            if (ownerActivitySummary) {
                showMessage(ownerActivitySummary, 'No matching activity records found.');
            }

            if (ownerActivityLoadMoreButton) {
                ownerActivityLoadMoreButton.hidden = true;
            }

            return;
        }

        records.forEach((record) => {
            const card = document.createElement('article');
            card.className = 'owner-activity-card';

            const heading = document.createElement('h3');
            const petName = record.pet?.name || 'Your pet';
            const activity = String(record.activity || 'unknown');
            const activityLabel =
                activity.charAt(0).toUpperCase() + activity.slice(1);

            heading.textContent = `${petName} — ${activityLabel}`;

            const collarLine = document.createElement('p');
            collarLine.className = 'muted';
            collarLine.textContent =
                `Collar: ${record.device?.deviceCode || 'Unknown device'}`;

            const durationLine = document.createElement('p');
            durationLine.textContent =
                record.durationSeconds === null ||
                record.durationSeconds === undefined
                    ? 'Duration: Not provided'
                    : `Duration: ${record.durationSeconds} seconds`;

            const measuredLine = document.createElement('p');
            measuredLine.className = 'muted';

            const measuredDate = record.measuredAt
                ? new Date(record.measuredAt)
                : null;

            measuredLine.textContent =
                measuredDate && !Number.isNaN(measuredDate.getTime())
                    ? `Measured: ${measuredDate.toLocaleString()}`
                    : 'Measured: Unknown time';

            const sensorLine = document.createElement('p');
            sensorLine.className = 'muted';

            const sensor = record.sensorSummary || {};
            sensorLine.textContent =
                sensor.averageAccelerationMagnitude === undefined ||
                sensor.averageAccelerationMagnitude === null
                    ? 'Sensor: Not provided'
                    : `Sensor: ${sensor.averageAccelerationMagnitude} g from ${sensor.sampleCount ?? '?'} samples`;

            card.append(
                heading,
                collarLine,
                durationLine,
                sensorLine,
                measuredLine
            );

            ownerActivityRecordsList.appendChild(card);
        });

        const shown = ownerActivitySkip + records.length;

        if (ownerActivityLoadMoreButton) {
            const hasMore = shown < ownerActivityTotal;

            ownerActivityLoadMoreButton.hidden = !hasMore;
            ownerActivityLoadMoreButton.disabled = false;
            ownerActivityLoadMoreButton.textContent =
                `Load more (${shown} of ${ownerActivityTotal})`;
        }

        if (ownerActivitySummary) {
            showMessage(
                ownerActivitySummary,
                ownerActivityTotal === 0
                    ? 'No matching activity records found.'
                    : `Showing ${shown} of ${ownerActivityTotal} activity record(s).`
            );
        }
    } catch (error) {
        if (!append) {
            ownerActivityRecordsList.replaceChildren();

            const errorMessage = document.createElement('p');
            errorMessage.className = 'message error';
            errorMessage.textContent =
                error.message || 'Unable to load activity records.';

            ownerActivityRecordsList.appendChild(errorMessage);
        }

        if (ownerActivityLoadMoreButton) {
            ownerActivityLoadMoreButton.disabled = false;
        }

        if (ownerActivitySummary) {
            showMessage(
                ownerActivitySummary,
                error.message || 'Unable to load activity records.',
                'error'
            );
        }
    } finally {
        ownerActivityRecordsList.setAttribute('aria-busy', 'false');

        if (refreshOwnerActivityButton) {
            refreshOwnerActivityButton.disabled = false;
        }

        if (ownerActivityLoadMoreButton) {
            ownerActivityLoadMoreButton.disabled = false;
        }
    }
}

    /**
     * Loads `/api/owner/feeding-events` with the selected pet and status filters, populating the pet filter first.
     * Renders an empty-state message when no events exist and re-enables the refresh button in `finally`.
     */
    async function loadOwnerFeedingEvents() {
    if (!refreshOwnerFeedingEventsButton || !ownerFeedingEventList) {
        return;
    }

    refreshOwnerFeedingEventsButton.disabled = true;

    showMessage(
        ownerFeedingEventsSummary,
        'Loading feeding history...'
    );

    // Replaced empty state with Skeleton Loader
    ownerFeedingEventList.replaceChildren(createSkeletonLoader(2));

    try {
        await populateOwnerFeedingPetFilter();

        const params = new URLSearchParams();

        if (ownerFeedingPetFilter?.value) {
            params.set('petId', ownerFeedingPetFilter.value);
        }

        if (ownerFeedingStatusFilter?.value) {
            params.set('status', ownerFeedingStatusFilter.value);
        }

        const query = params.toString();
        const endpoint = query
            ? `/api/owner/feeding-events?${query}`
            : '/api/owner/feeding-events';

        const data = await apiRequest(endpoint);
        const events = Array.isArray(data.events) ? data.events : [];

        if (events.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent =
                'No feeding events have been recorded for your pets yet.';

            ownerFeedingEventList.appendChild(empty);

            showMessage(
                ownerFeedingEventsSummary,
                'No feeding events found.'
            );

            return;
        }

        events.forEach((event) => {
            ownerFeedingEventList.appendChild(
                createOwnerFeedingEventCard(event)
            );
        });

        showMessage(
            ownerFeedingEventsSummary,
            `${events.length} feeding event(s) loaded.`,
            'success'
        );
    } catch (error) {
        showMessage(
            ownerFeedingEventsSummary,
            error.message || 'Unable to load feeding history.',
            'error'
        );
    } finally {
        refreshOwnerFeedingEventsButton.disabled = false;
    }
}


/**
 * Fetches `/api/owner/notifications`, renders the cards and updates the sidebar and overview unread counts from `unreadCount`.
 */
async function loadNotifications() {
    refreshNotificationsButton.disabled = true;
    showMessage(notificationsSummary, 'Loading notifications...');
    
    // Replaced empty state with Skeleton Loader
    ownerNotificationList.replaceChildren(createSkeletonLoader(3));

    try {
        const data = await apiRequest('/api/owner/notifications');
        const notifications = Array.isArray(data.notifications) ? data.notifications : [];
        const unreadCount = Number(data.unreadCount) || 0;

        if (sidebarUnreadCount) sidebarUnreadCount.textContent = unreadCount;
        if (overviewUnreadCount) overviewUnreadCount.textContent = unreadCount;

        showMessage(notificationsSummary, `${unreadCount} unread notification(s).`, 'success');

        if (notifications.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'You have no notifications yet.';
            ownerNotificationList.replaceChildren(empty);
            return;
        }

        ownerNotificationList.replaceChildren();

        notifications.forEach((notification) => {
            ownerNotificationList.appendChild(createNotificationCard(notification));
        });
    } catch (error) {
        showMessage(notificationsSummary, error.message || 'Unable to load notifications.', 'error');
    } finally {
        refreshNotificationsButton.disabled = false;
    }
}

/**
 * PATCHes the notification as read and then reloads the whole notification list.
 * The button stays disabled while the request is in flight and is re-enabled if it fails.
 */
async function markNotificationAsRead(notificationId, button) {
    button.disabled = true;
    try {
        await apiRequest(`/api/owner/notifications/${encodeURIComponent(notificationId)}/read`, { method: 'PATCH' });
        await loadNotifications();
    } catch (error) {
        button.disabled = false;
    }
}

// --- Browser push notifications (Web Push) ---
/**
 * Converts a base64url VAPID public key into the Uint8Array expected by `pushManager.subscribe`.
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const output = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i += 1) {
        output[i] = rawData.charCodeAt(i);
    }

    return output;
}

/**
 * Delegates to `showMessage` for the push status element, doing nothing when that element is absent.
 */
function setPushStatus(message, type = '') {
    if (pushStatus) {
        showMessage(pushStatus, message, type);
    }
}

/**
 * Sets the enable-notifications button's label, disabled state and status text for the unsupported, blocked, already-subscribed and available cases.
 */
function updatePushButton({ supported, isSubscribed, permission }) {
    if (!enableNotificationsButton) return;

    if (!supported) {
        enableNotificationsButton.disabled = true;
        enableNotificationsButton.textContent = 'Notifications Not Supported';
        setPushStatus('Browser notifications are not configured on the server.', 'error');
        return;
    }

    if (permission === 'denied') {
        enableNotificationsButton.disabled = true;
        enableNotificationsButton.textContent = 'Notifications Blocked';
        setPushStatus('Notifications are blocked for this site. Allow them in your browser settings, then reload.', 'error');
        return;
    }

    if (isSubscribed) {
        enableNotificationsButton.disabled = true;
        enableNotificationsButton.textContent = 'Notifications Enabled';
        setPushStatus('Browser notifications are on. You will receive reminders even when this tab is closed.', 'success');
        return;
    }

    enableNotificationsButton.disabled = false;
    enableNotificationsButton.textContent = 'Enable Browser Notifications';
}

/**
 * Reads `/api/owner/push-subscription` and refreshes the push button state.
 * Bails out early when the button or the Notification API is missing.
 */
async function refreshPushStatus() {
    if (!enableNotificationsButton || !('Notification' in window)) return;

    try {
        const config = await apiRequest('/api/owner/push-subscription');

        updatePushButton({
            supported: Boolean(config.supported),
            isSubscribed: Boolean(config.isSubscribed),
            permission: Notification.permission
        });
    } catch (error) {
        setPushStatus(error.message || 'Unable to check notification status.', 'error');
        enableNotificationsButton.disabled = false;
        enableNotificationsButton.textContent = 'Enable Browser Notifications';
    }
}

/**
 * Requests notification permission, registers `/sw.js`, subscribes with the server's VAPID key and POSTs the resulting subscription.
 * Failures are surfaced through the push status text and the button is reset.
 */
async function enablePushNotifications() {
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
        setPushStatus('This browser does not support push notifications.', 'error');
        return;
    }

    if (enableNotificationsButton) {
        enableNotificationsButton.disabled = true;
    }

    try {
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            updatePushButton({ supported: true, isSubscribed: false, permission });
            setPushStatus('Notification permission was not granted.', 'error');
            return;
        }

        const registration = await navigator.serviceWorker.register('/sw.js');

        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            const config = await apiRequest('/api/owner/push-subscription');

            if (!config.supported || !config.vapidPublicKey) {
                throw new Error('Browser notifications are not configured on the server.');
            }

            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey)
            });
        }

        await apiRequest('/api/owner/push-subscription', {
            method: 'POST',
            body: JSON.stringify(subscription.toJSON())
        });

        await refreshPushStatus();
    } catch (error) {
        setPushStatus(error.message || 'Unable to enable browser notifications.', 'error');
        if (enableNotificationsButton) {
            enableNotificationsButton.disabled = false;
            enableNotificationsButton.textContent = 'Enable Browser Notifications';
        }
    }
}

if (enableNotificationsButton) {
    enableNotificationsButton.addEventListener('click', enablePushNotifications);
}

const notificationsNavigationButton = document.querySelector('.nav-item[data-view="notifications"]');
if (notificationsNavigationButton) {
    notificationsNavigationButton.addEventListener('click', () => {
        loadNotifications();
        refreshPushStatus();
    });
}

/**
 * Fetches `/api/owner/pets`, updates the sidebar and overview pet counts and renders a flip card per pet.
 * Falls back to an empty-state message and re-enables the refresh button in `finally`.
 */
async function loadPets() {
    refreshPetsButton.disabled = true;
    showMessage(petsMessage, 'Loading registered pets...');

    // Replaced empty state with Skeleton Loader
    petList.replaceChildren(createSkeletonLoader(2));

    try {
        const data = await apiRequest('/api/owner/pets');
        
        const pets = Array.isArray(data.pets) ? data.pets : [];
        const count = data.count ?? pets.length;

        if (sidebarPetsCount) sidebarPetsCount.textContent = count;
        if (overviewPetsCount) overviewPetsCount.textContent = count;

        if (pets.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'You have not registered any pets yet. Use the Register tab to add your first pet.';
            petList.replaceChildren(empty);
        } else {
            petList.replaceChildren();
            pets.forEach((pet) => {
                petList.appendChild(createPetCard(pet));
            });
        }

        showMessage(petsMessage, `${count} pet record(s) found.`, 'success');
    } catch (error) {
        showMessage(petsMessage, error.message, 'error');
    } finally {
        refreshPetsButton.disabled = false;
    }
}

/**
 * Confirms the token via `/api/auth/me` and gates the page to the `owner` role before loading pets and notifications.
 * A missing token logs out; a non-owner only gets an error message.
 */
async function verifyOwner() {
    if (!token) {
        logout();
        return;
    }

    try {
        const data = await apiRequest('/api/auth/me');

        if (data.user?.role !== 'owner') {
            showMessage(dashboardMessage, 'This page is only for pet-owner accounts.', 'error');
            return;
        }

        ownerVerified = true;
        updatePinSetupBanner(Boolean(data.hasPin));
        welcomeHeading.textContent = `Welcome, ${data.user.fullName || 'Pet Owner'}`;
        showMessage(dashboardMessage, 'Your account is verified.', 'success');

        await Promise.all([loadPets(), loadNotifications()]);
        void refreshPushStatus();
    } catch (error) {
        showMessage(dashboardMessage, error.message, 'error');
    }
}

registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!ownerVerified) {
        showMessage(registrationMessage, 'Your owner account has not been verified.', 'error');
        return;
    }

    registerPetButton.disabled = true;
    showMessage(registrationMessage, 'Submitting pet registration...');

    const formData = new FormData(registrationForm);
    const petData = {
        name: String(formData.get('name') || '').trim(),
        species: String(formData.get('species') || ''),
        breed: String(formData.get('breed') || '').trim(),
        sex: String(formData.get('sex') || 'unknown'),
        color: String(formData.get('color') || '').trim()
    };

    const dateOfBirth = String(formData.get('dateOfBirth') || '');
    if (dateOfBirth) petData.dateOfBirth = dateOfBirth;

    try {
        const uploadData = new FormData();

        uploadData.append('name', petData.name);
        uploadData.append('species', petData.species);

        if (petData.breed) {
            uploadData.append('breed', petData.breed);
        }

        if (petData.sex) {
            uploadData.append('sex', petData.sex);
        }

        if (petData.color) {
            uploadData.append('color', petData.color);
        }

        if (petData.dateOfBirth) {
            uploadData.append('dateOfBirth', petData.dateOfBirth);
        }

        const photoInput = document.getElementById('petPhoto');

        if (photoInput && photoInput.files.length > 0) {
            uploadData.append('petPhoto', photoInput.files[0]);
        }

        const data = await apiRequest('/api/owner/pets', {
            method: 'POST',
            body: uploadData
        });

        showMessage(registrationMessage, data.message || 'Pet registration submitted for review.', 'success');
        registrationForm.reset();
        await loadPets();
        switchView('mypets');
    } catch (error) {
        showMessage(registrationMessage, error.message, 'error');
    } finally {
        registerPetButton.disabled = false;
    }
});

resetFormButton.addEventListener('click', () => { showMessage(registrationMessage, ''); });
refreshPetsButton.addEventListener('click', loadPets);
refreshNotificationsButton.addEventListener('click', loadNotifications);


const feedingHistoryNavButton = document.querySelector('[data-view="feeding"]');

if (feedingHistoryNavButton) {
    feedingHistoryNavButton.addEventListener('click', loadOwnerFeedingEvents);
}

// Populate the Activity Monitoring pet filter.
/**
 * Populates the activity pet filter from `/api/owner/pets` once (guarded by `data-loaded`) and restores the previously selected pet when it still exists.
 * Failures are logged and reported through the activity summary.
 */
async function loadOwnerActivityPetOptions() {
    if (!ownerActivityPetFilter) return;

    try {
        const data = await apiRequest('/api/owner/pets');
        const pets = Array.isArray(data.pets) ? data.pets : [];

        const previousValue = ownerActivityPetFilter.value;

        ownerActivityPetFilter.replaceChildren();

        const allPetsOption = document.createElement('option');
        allPetsOption.value = '';
        allPetsOption.textContent = 'All my pets';
        ownerActivityPetFilter.appendChild(allPetsOption);

        pets.forEach((pet) => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = pet.name || 'Unnamed pet';
            ownerActivityPetFilter.appendChild(option);
        });

        if (
            previousValue &&
            pets.some((pet) => pet.id === previousValue)
        ) {
            ownerActivityPetFilter.value = previousValue;
        }

        ownerActivityPetFilter.dataset.loaded = 'true';
    } catch (error) {
        console.error('Unable to load activity pet options:', error);

        if (ownerActivitySummary) {
            showMessage(
                ownerActivitySummary,
                'Unable to load your pet list. Please try again.',
                'error'
            );
        }
    }
}

// Load activity data when the owner opens Activity Monitoring.
const ownerActivityNavButton = document.querySelector(
    '[data-view="activity"]'
);

if (ownerActivityNavButton) {
    ownerActivityNavButton.addEventListener('click', async () => {
        if (ownerActivityPetFilter?.dataset.loaded !== 'true') {
            await loadOwnerActivityPetOptions();
        }

        await loadOwnerActivityRecords();
    });
}

// Refresh the activity history.
if (refreshOwnerActivityButton) {
    refreshOwnerActivityButton.addEventListener(
        'click',
        loadOwnerActivityRecords
    );
}

// Apply the filters whenever their selections change.
if (ownerActivityPetFilter) {
    ownerActivityPetFilter.addEventListener(
        'change',
        loadOwnerActivityRecords
    );
}

if (ownerActivityTypeFilter) {
    ownerActivityTypeFilter.addEventListener(
        'change',
        loadOwnerActivityRecords
    );
}

if (ownerActivityFromFilter) {
    ownerActivityFromFilter.addEventListener(
        'change',
        loadOwnerActivityRecords
    );
}

// Append the next page instead of replacing the list.
if (ownerActivityLoadMoreButton) {
    ownerActivityLoadMoreButton.addEventListener('click', () => {
        loadOwnerActivityRecords({ append: true });
    });
}


if (refreshOwnerFeedingEventsButton) {
    refreshOwnerFeedingEventsButton.addEventListener('click', loadOwnerFeedingEvents);
}

if (applyOwnerFeedingFiltersButton) {
    applyOwnerFeedingFiltersButton.addEventListener('click', loadOwnerFeedingEvents);
}


/* Sidebar navigation and desktop collapse */
/**
 * Wires the sidebar collapse toggle and the mobile drawer (backdrop, Escape key, focus restore).
 * Persists the desktop collapsed state under the `smartvetOwnerSidebarCollapsed` localStorage key.
 */
(function initializeOwnerSidebarToggle() {
    const shell = document.querySelector('.owner-shell');
    const toggle = document.getElementById('ownerSidebarToggle');
    const mobileToggle = document.getElementById('ownerSidebarOpen');
    const mobileClose = document.getElementById('ownerSidebarClose');
    const backdrop = document.getElementById('ownerSidebarBackdrop');
    const mobileQuery = window.matchMedia('(max-width: 760px)');

    if (!shell || !toggle || !mobileToggle || !mobileClose || !backdrop) return;

    const storageKey = 'smartvetOwnerSidebarCollapsed';

    /**
     * Toggles the mobile drawer classes and backdrop while syncing `aria-expanded`.
     * Moves focus to the close button on open, or back to the toggle when `restoreFocus` is set.
     */
    function setMobileSidebarOpen(open, restoreFocus = false) {
        shell.classList.toggle('sidebar-open', open);
        document.body.classList.toggle('sidebar-open', open);
        mobileToggle.setAttribute('aria-expanded', String(open));
        backdrop.hidden = !open;

        if (open) {
            mobileClose.focus();
        } else if (restoreFocus) {
            mobileToggle.focus();
        }
    }

    /**
     * Applies the `sidebar-collapsed` class only at desktop widths and updates the toggle's `aria-expanded`, label and title.
     */
    function applyCollapsedState(collapsed) {
        const isMobile = mobileQuery.matches;
        shell.classList.toggle('sidebar-collapsed', !isMobile && collapsed);

        const action = collapsed ? 'Expand' : 'Collapse';
        toggle.setAttribute('aria-expanded', String(!isMobile && !collapsed));
        toggle.setAttribute('aria-label', `${action} sidebar`);
        toggle.title = `${action} sidebar`;
    }

    applyCollapsedState(
        localStorage.getItem(storageKey) === 'true'
    );

    toggle.addEventListener('click', () => {
        if (mobileQuery.matches) {
            setMobileSidebarOpen(false, true);
            return;
        }

        const collapsed = !shell.classList.contains('sidebar-collapsed');

        applyCollapsedState(collapsed);
        localStorage.setItem(storageKey, String(collapsed));
    });

    mobileToggle.addEventListener('click', () => setMobileSidebarOpen(true));
    mobileClose.addEventListener('click', () => setMobileSidebarOpen(false, true));
    backdrop.addEventListener('click', () => setMobileSidebarOpen(false, true));

    document.querySelectorAll('.nav-item[data-view], .nav-subitem').forEach((item) => {
        item.addEventListener('click', () => {
            if (mobileQuery.matches) {
                setMobileSidebarOpen(false, true);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && shell.classList.contains('sidebar-open')) {
            setMobileSidebarOpen(false, true);
        }
    });

    mobileQuery.addEventListener('change', () => {
        setMobileSidebarOpen(false);
        applyCollapsedState(localStorage.getItem(storageKey) === 'true');
    });
})();



/* SmartVet shared light/dark theme */
/**
 * Restores the light/dark theme from the `smartvetTheme` localStorage key and wires the theme option buttons.
 * Selecting an option applies the theme, persists it and shows a confirmation message.
 */
(function initializeOwnerTheme() {
    const storageKey = 'smartvetTheme';
    const themeMessage = document.getElementById('themeMessage');
    const optionButtons = Array.from(
        document.querySelectorAll('[data-theme-option]')
    );

    /**
     * Returns 'dark' or 'light' based on `document.body.dataset.theme`.
     */
    function currentTheme() {
        return document.body.dataset.theme === 'dark' ? 'dark' : 'light';
    }

    /**
     * Sets `document.body.dataset.theme` and marks the matching theme option button as selected and pressed.
     */
    function applyTheme(theme) {
        const isDark = theme === 'dark';

        document.body.dataset.theme = isDark ? 'dark' : 'light';

        optionButtons.forEach((button) => {
            const selected = button.dataset.themeOption === (isDark ? 'dark' : 'light');

            button.classList.toggle('is-selected', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
    }

    applyTheme(localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light');

    optionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextTheme = button.dataset.themeOption === 'dark' ? 'dark' : 'light';

            if (nextTheme === currentTheme()) return;

            document.body.classList.add('theme-transitioning');

            applyTheme(nextTheme);
            localStorage.setItem(storageKey, nextTheme);

            if (themeMessage) {
                showMessage(
                    themeMessage,
                    nextTheme === 'dark' ? 'Dark theme applied.' : 'Light theme applied.',
                    'success'
                );
            }

            window.setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 400);
        });
    });
})();

/* ==========================================
   MY ACCOUNT — PERSONAL PROFILE & SINGLE SUBMISSION
   ========================================== */

const accountProfileForm = document.getElementById('accountProfileForm');
const accountFullName = document.getElementById('accountFullName');
const accountEmail = document.getElementById('accountEmail');
const accountPhone = document.getElementById('accountPhone');
const accountAddress = document.getElementById('accountAddress');
const accountPermanentAddress = document.getElementById('accountPermanentAddress');
const accountDateOfBirth = document.getElementById('accountDateOfBirth');
const accountGender = document.getElementById('accountGender');
const accountCivilStatus = document.getElementById('accountCivilStatus');
const accountNationality = document.getElementById('accountNationality');
const accountGovId = document.getElementById('accountGovId');
const accountOccupation = document.getElementById('accountOccupation');
const accountProfileMessage = document.getElementById('accountProfileMessage');
const saveAccountProfileButton = document.getElementById('saveAccountProfileButton');

const accountPhotoInput = document.getElementById('accountPhotoInput');
const accountProfilePhoto = document.getElementById('accountProfilePhoto');
const accountProfileInitials = document.getElementById('accountProfileInitials');

// NEW: Reference to the custom Uiverse "Choose photo" button
const triggerPhotoBtn = document.getElementById('triggerPhotoBtn');

let accountPhotoObjectUrl = null;

/**
 * Renders up to two uppercase initials in the profile avatar placeholder, falling back to a person emoji.
 */
function updateAccountInitials(fullName) {
    if (!accountProfileInitials) return;

    const initials = String(fullName || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

    accountProfileInitials.textContent = initials || '👤';
}

/**
 * Fills the account form fields, the cached `ownerEmail`, the welcome heading and the account card title from a user object.
 */
function displayOwnerProfile(user) {
    accountFullName.value = user.fullName || '';
    accountEmail.value = user.email || '';
    ownerEmail = user.email || '';
    accountPhone.value = user.phone || '';
    accountAddress.value = user.address || '';
    accountPermanentAddress.value = user.permanentAddress || '';
    accountDateOfBirth.value = user.dateOfBirth || '';
    accountGender.value = user.gender || '';
    accountCivilStatus.value = user.civilStatus || '';
    accountNationality.value = user.nationality || '';
    accountGovId.value = user.govId || '';
    accountOccupation.value = user.occupation || '';

    updateAccountInitials(user.fullName);
    if (welcomeHeading) {
        welcomeHeading.textContent = `Welcome, ${user.fullName || 'Pet Owner'}`;
    }

    const cardTitle = document.getElementById('accountCardTitle');
    if (cardTitle) {
        cardTitle.textContent = user.fullName || 'My Account';
    }
}

// Live Photo Selection & Preview Handler
if (accountPhotoInput) {
    
    // NEW: Trigger the hidden file input when the Uiverse button is clicked
    if (triggerPhotoBtn) {
        triggerPhotoBtn.addEventListener('click', () => {
            accountPhotoInput.click();
        });
    }

    accountPhotoInput.addEventListener('change', () => {
        const file = accountPhotoInput.files?.[0];
        if (accountPhotoObjectUrl) {
            URL.revokeObjectURL(accountPhotoObjectUrl);
            accountPhotoObjectUrl = null;
        }

        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            accountPhotoInput.value = '';
            showMessage(accountProfileMessage, 'Choose a JPG, PNG, or WebP image.', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            accountPhotoInput.value = '';
            showMessage(accountProfileMessage, 'The profile photo must not exceed 5 MB.', 'error');
            return;
        }

        accountPhotoObjectUrl = URL.createObjectURL(file);
        
        if (accountProfilePhoto) {
            accountProfilePhoto.src = accountPhotoObjectUrl;
            accountProfilePhoto.hidden = false;
        }
        if (accountProfileInitials) {
            accountProfileInitials.hidden = true;
        }
        
        showMessage(accountProfileMessage, '');
    });
}

/**
 * Fetches `/api/owner/profile/photo` with the bearer token and reveals the image only once it has loaded.
 * Reverts to the initials avatar on a non-OK response or any error.
 */
async function loadAccountPhoto() {
    if (!accountProfilePhoto || !accountProfileInitials) return;

    try {
        const response = await fetch('/api/owner/profile/photo', {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'image/*'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            accountProfilePhoto.hidden = true;
            accountProfileInitials.hidden = false;
            return;
        }

        const imageBlob = await response.blob();
        const newObjectUrl = URL.createObjectURL(imageBlob);

        const image = new Image();
        image.onload = () => {
            accountProfilePhoto.src = newObjectUrl;
            accountProfilePhoto.hidden = false;
            accountProfileInitials.hidden = true;
        };
        image.src = newObjectUrl;
    } catch {
        accountProfilePhoto.hidden = true;
        accountProfileInitials.hidden = false;
    }
}

/**
 * Loads `/api/owner/profile`, renders it, then loads the profile photo or falls back to the initials avatar.
 * Disables the save button while the request is in flight.
 */
async function loadOwnerProfile() {
    if (!accountProfileForm) return;

    showMessage(accountProfileMessage, 'Loading your personal information...');

    if (saveAccountProfileButton) {
        saveAccountProfileButton.disabled = true;
    }

    try {
        const data = await apiRequest('/api/owner/profile');
        const user = data.user;

        displayOwnerProfile(user);
        showMessage(accountProfileMessage, '');

        if (user.hasProfilePhoto) {
            await loadAccountPhoto();
        } else {
            if (accountProfilePhoto) {
                accountProfilePhoto.hidden = true;
                accountProfilePhoto.removeAttribute('src');
            }
            if (accountProfileInitials) {
                accountProfileInitials.hidden = false;
            }
        }
    } catch (error) {
        showMessage(accountProfileMessage, error.message || 'Unable to load your account.', 'error');
    } finally {
        if (saveAccountProfileButton) {
            saveAccountProfileButton.disabled = false;
        }
    }
}

const accountNavigationButton = document.querySelector('[data-view="account"]');
if (accountNavigationButton) {
    accountNavigationButton.addEventListener('click', loadOwnerProfile);
}

// Unified Submit: Save text details and upload photo together via Save Changes button
if (accountProfileForm) {
    accountProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        showMessage(accountProfileMessage, '');

        saveAccountProfileButton.disabled = true;
        saveAccountProfileButton.textContent = 'Saving...';

        let profileSaved = false;

        try {
            const file = accountPhotoInput?.files?.[0];

            // 1. Save profile text details (PATCH)
            const profileData = await apiRequest('/api/owner/profile', {
                method: 'PATCH',
                body: JSON.stringify({
                    fullName: accountFullName.value.trim(),
                    email: accountEmail.value.trim(),
                    phone: accountPhone.value.trim(),
                    address: accountAddress.value.trim(),
                    permanentAddress: accountPermanentAddress.value.trim(),
                    dateOfBirth: accountDateOfBirth.value,
                    gender: accountGender.value,
                    civilStatus: accountCivilStatus.value,
                    nationality: accountNationality.value.trim(),
                    govId: accountGovId.value.trim(),
                    occupation: accountOccupation.value
                })
            });
            displayOwnerProfile(profileData.user);
            profileSaved = true;

            // 2. Upload photo if selected (POST)
            if (file) {
                const photoFormData = new FormData();
                photoFormData.append('profilePhoto', file);
                await apiRequest('/api/owner/profile/photo', {
                    method: 'POST',
                    body: photoFormData
                });
                await loadAccountPhoto();
                accountPhotoInput.value = '';
            }

            showMessage(accountProfileMessage, 'Account changes saved successfully!', 'success');
        } catch (error) {
            const message = profileSaved
                ? `Personal information was saved, but the profile photo could not be uploaded: ${error.message}`
                : error.message || 'Unable to save your account changes.';
            showMessage(accountProfileMessage, message, 'error');
        } finally {
            saveAccountProfileButton.disabled = false;
            saveAccountProfileButton.textContent = 'Save Changes';
        }
    });
}


/* ==========================================
   SETTINGS — PIN CODE & PIN SETUP BANNER
   ========================================== */

const PIN_LENGTH = 6;
const PIN_PATTERN = new RegExp(`^\\d{${PIN_LENGTH}}$`);
const PIN_BANNER_KEY = 'smartvetOwnerPinBannerDismissed';

let ownerEmail = '';
let pinRemoveArmed = false;
let pinRemoveTimer = null;

const pinSetupBanner = document.getElementById('pinSetupBanner');
const setupPinButton = document.getElementById('setupPinButton');
const dismissPinBanner = document.getElementById('dismissPinBanner');

const pinNavigationButton = document.querySelector('[data-view="pin"]');
const pinMessage = document.getElementById('pinMessage');
const pinStatus = document.getElementById('pinStatus');
const pinForm = document.getElementById('pinForm');
const newPinBoxes = document.getElementById('newPinBoxes');
const confirmPinBoxes = document.getElementById('confirmPinBoxes');
const newPinEntry = newPinBoxes ? SmartVetPinBoxes.init(newPinBoxes) : null;
const confirmPinEntry = confirmPinBoxes ? SmartVetPinBoxes.init(confirmPinBoxes) : null;
const pinFormMessage = document.getElementById('pinFormMessage');
const savePinButton = document.getElementById('savePinButton');
const removePinButton = document.getElementById('removePinButton');
const forgotPinButton = document.getElementById('forgotPinButton');
const forgotPinPanel = document.getElementById('forgotPinPanel');
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
const cancelForgotPinButton = document.getElementById('cancelForgotPinButton');

/**
 * Shows the PIN setup banner only when no PIN is set and it has not been dismissed.
 * Dismissal is read from the `smartvetOwnerPinBannerDismissed` localStorage key, with storage errors treated as not dismissed.
 */
function updatePinSetupBanner(hasPin) {
    if (!pinSetupBanner) return;

    let dismissed = false;

    try {
        dismissed = localStorage.getItem(PIN_BANNER_KEY) === 'true';
    } catch (error) {
        dismissed = false;
    }

    pinSetupBanner.hidden = Boolean(hasPin) || dismissed;
}

/**
 * Hides the banner and records the dismissal in localStorage, swallowing errors where storage is unavailable.
 */
function dismissPinSetupBanner() {
    try {
        localStorage.setItem(PIN_BANNER_KEY, 'true');
    } catch (error) {
        // Storage can be unavailable in private browsing mode.
    }

    if (pinSetupBanner) {
        pinSetupBanner.hidden = true;
    }
}

if (setupPinButton) {
    setupPinButton.addEventListener('click', () => {
        dismissPinSetupBanner();
        switchView('pin');
        loadPinSettings();
    });
}

if (dismissPinBanner) {
    dismissPinBanner.addEventListener('click', dismissPinSetupBanner);
}

/**
 * Updates the PIN status text and `is-set` class, toggles the Remove PIN button's visibility and disarms any pending removal confirmation.
 */
function setPinStatus(hasPin, pinSetAt) {
    if (pinStatus) {
        const when = pinSetAt ? new Date(pinSetAt) : null;

        if (hasPin) {
            pinStatus.textContent = when && !Number.isNaN(when.getTime())
                ? `PIN is set · saved ${when.toLocaleDateString()}`
                : 'PIN is set.';
            pinStatus.classList.add('is-set');
        } else {
            pinStatus.textContent = 'No PIN is set. Add one to unlock this app faster.';
            pinStatus.classList.remove('is-set');
        }
    }

    if (removePinButton) {
        removePinButton.hidden = !hasPin;
    }

    disarmPinRemoval();
}

/**
 * Fetches `/api/owner/profile` to cache the owner email, prefill the forgot-PIN email field and refresh the PIN status.
 */
async function loadPinSettings() {
    if (!pinForm) return;

    try {
        const data = await apiRequest('/api/owner/profile');
        const user = data.user || {};

        ownerEmail = user.email || ownerEmail;

        if (forgotPinEmail && user.email) {
            forgotPinEmail.value = user.email;
        }

        setPinStatus(Boolean(user.hasPin), user.pinSetAt);
    } catch (error) {
        if (pinMessage) {
            showMessage(pinMessage, error.message || 'Unable to load your PIN settings.', 'error');
        }
    }
}

if (pinNavigationButton) {
    pinNavigationButton.addEventListener('click', loadPinSettings);
}

if (pinForm) {
    pinForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        showMessage(pinFormMessage, '');

        const pin = newPinEntry ? newPinEntry.getValue() : '';
        const confirmPin = confirmPinEntry ? confirmPinEntry.getValue() : '';

        if (!PIN_PATTERN.test(pin)) {
            showMessage(pinFormMessage, 'Your PIN must be exactly 6 digits.', 'error');
            return;
        }

        if (pin !== confirmPin) {
            showMessage(pinFormMessage, 'The PINs do not match.', 'error');
            return;
        }

        savePinButton.disabled = true;
        const originalLabel = savePinButton.textContent;
        savePinButton.textContent = 'Saving...';

        try {
            await apiRequest('/api/owner/pin', {
                method: 'POST',
                body: JSON.stringify({ pin })
            });

            const storedUser = SmartVetSession.getUser() || {};
            const accountEmail = ownerEmail || storedUser.email || '';

            if (accountEmail) {
                SmartVetSession.savePinAccount({
                    email: accountEmail,
                    fullName: storedUser.fullName || ''
                });
            }

            pinForm.reset();
            if (newPinEntry) newPinEntry.clear();
            if (confirmPinEntry) confirmPinEntry.clear();
            setPinStatus(true, new Date().toISOString());
            updatePinSetupBanner(true);
            showMessage(
                pinFormMessage,
                'PIN saved. Use it to unlock the app next time.',
                'success'
            );
        } catch (error) {
            showMessage(pinFormMessage, error.message || 'Unable to save your PIN.', 'error');
        } finally {
            savePinButton.disabled = false;
            savePinButton.textContent = originalLabel;
        }
    });
}

/**
 * Resets the two-step Remove PIN confirmation by clearing the armed flag and timer and restoring the button label and `aria-pressed`.
 */
function disarmPinRemoval() {
    pinRemoveArmed = false;

    if (pinRemoveTimer) {
        window.clearTimeout(pinRemoveTimer);
        pinRemoveTimer = null;
    }

    if (removePinButton) {
        removePinButton.textContent = 'Remove PIN';
        removePinButton.setAttribute('aria-pressed', 'false');
    }
}

if (removePinButton) {
    removePinButton.addEventListener('click', async () => {
        if (!pinRemoveArmed) {
            pinRemoveArmed = true;
            removePinButton.textContent = 'Click again to confirm';
            removePinButton.setAttribute('aria-pressed', 'true');
            pinRemoveTimer = window.setTimeout(disarmPinRemoval, 4000);
            return;
        }

        disarmPinRemoval();
        removePinButton.disabled = true;

        try {
            await apiRequest('/api/owner/pin', { method: 'DELETE' });

            SmartVetSession.clearPinAccount();
            setPinStatus(false);
            updatePinSetupBanner(false);
            showMessage(
                pinFormMessage,
                'PIN removed. Sign in with your email and password.',
                'success'
            );
        } catch (error) {
            showMessage(pinFormMessage, error.message || 'Unable to remove your PIN.', 'error');
        } finally {
            removePinButton.disabled = false;
        }
    });
}

if (forgotPinButton) {
    forgotPinButton.addEventListener('click', () => {
        showMessage(forgotPinMessage, '');
        forgotPinForm.reset();

        // reset() clears the prefilled account email, so put it back.
        if (forgotPinEmail) {
            forgotPinEmail.value = ownerEmail || '';
        }

        if (forgotPinNew) forgotPinNew.clear();
        if (forgotPinConfirm) forgotPinConfirm.clear();

        forgotPinPanel.hidden = !forgotPinPanel.hidden;

        if (!forgotPinPanel.hidden) {
            forgotPinPassword.focus();
        }
    });
}

if (cancelForgotPinButton) {
    cancelForgotPinButton.addEventListener('click', () => {
        forgotPinPanel.hidden = true;
        forgotPinForm.reset();
        if (forgotPinNew) forgotPinNew.clear();
        if (forgotPinConfirm) forgotPinConfirm.clear();
        showMessage(forgotPinMessage, '');
    });
}

if (forgotPinForm) {
    forgotPinForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        showMessage(forgotPinMessage, '');

        const email = forgotPinEmail.value.trim();
        const password = forgotPinPassword.value;
        const pin = forgotPinNew ? forgotPinNew.getValue() : '';
        const confirmPin = forgotPinConfirm ? forgotPinConfirm.getValue() : '';

        if (!PIN_PATTERN.test(pin)) {
            showMessage(forgotPinMessage, 'Your PIN must be exactly 6 digits.', 'error');
            return;
        }

        if (pin !== confirmPin) {
            showMessage(forgotPinMessage, 'The PINs do not match.', 'error');
            return;
        }

        resetPinButton.disabled = true;
        const originalLabel = resetPinButton.textContent;
        resetPinButton.textContent = 'Resetting...';

        try {
            // Public endpoint: a wrong password must not end the current session.
            const response = await fetch('/api/auth/pin/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ email, password, pin })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || data.success === false) {
                throw new Error(data.message || 'Unable to reset your PIN.');
            }

            if (data.user && data.user.email) {
                SmartVetSession.savePinAccount(data.user);
                ownerEmail = data.user.email;
            }

            forgotPinPanel.hidden = true;
            forgotPinForm.reset();
            if (forgotPinNew) forgotPinNew.clear();
            if (forgotPinConfirm) forgotPinConfirm.clear();
            setPinStatus(true, new Date().toISOString());
            updatePinSetupBanner(true);
            showMessage(pinFormMessage, 'Your PIN has been reset.', 'success');
        } catch (error) {
            showMessage(forgotPinMessage, error.message || 'Unable to reset your PIN.', 'error');
        } finally {
            resetPinButton.disabled = false;
            resetPinButton.textContent = originalLabel;
        }
    });
}

verifyOwner();