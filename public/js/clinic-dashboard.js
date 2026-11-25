const petList = document.getElementById('petList');
const listMessage = document.getElementById('listMessage');
const sessionMessage = document.getElementById('sessionMessage');
const welcomeHeading = document.getElementById('welcomeHeading');
const refreshButton = document.getElementById('refreshButton');
const logoutButton = document.getElementById('logoutButton');

const sessionBadge = document.getElementById('sessionBadge');
const pendingCount = document.getElementById('pendingCount');
const approvedCount = document.getElementById('approvedCount');

const registeredPetsCount = document.getElementById('registeredPetsCount');
const overdueVaccineCount = document.getElementById('overdueVaccineCount');
const dueSoonVaccineCount = document.getElementById('dueSoonVaccineCount');

// Overall vaccination status donut elements.
const vaccinationStatusDonut = document.getElementById('vaccinationStatusDonut');
const vaccinationStatusTotal = document.getElementById('vaccinationStatusTotal');
const vaccinationStatusUpToDate = document.getElementById('vaccinationStatusUpToDate');
const vaccinationStatusDueSoon = document.getElementById('vaccinationStatusDueSoon');
const vaccinationStatusOverdue = document.getElementById('vaccinationStatusOverdue');
const registrationTrendChart = document.getElementById('registrationTrendChart');
const registrationTrendSummary = document.getElementById('registrationTrendSummary');

const approvalResultContainer = document.getElementById(
    'approvalResultContainer'
);

const approvedPetSelect = document.getElementById('approvedPetSelect');
const selectedPetInfo = document.getElementById('selectedPetInfo');
const vaccinationForm = document.getElementById('vaccinationForm');
const vaccinationMessage = document.getElementById('vaccinationMessage');
const vaccinationHistory = document.getElementById('vaccinationHistory');

const feedingStatusFilter = document.getElementById('feedingStatusFilter');
const refreshFeedingEventsButton = document.getElementById('refreshFeedingEventsButton');
const feedingEventsHistory = document.getElementById('feedingEventsHistory');


// Device Management elements
const deviceRegistrationForm = document.getElementById('deviceRegistrationForm');
const deviceCodeInput = document.getElementById('deviceCodeInput');
const deviceTypeInput = document.getElementById('deviceTypeInput');
const devicePetSelect = document.getElementById('devicePetSelect');
const deviceFirmwareVersionInput = document.getElementById('deviceFirmwareVersionInput');
const deviceDescriptionInput = document.getElementById('deviceDescriptionInput');
const registerDeviceButton = document.getElementById('registerDeviceButton');
const deviceRegistrationMessage = document.getElementById('deviceRegistrationMessage');

const deviceTokenPanel = document.getElementById('deviceTokenPanel');
const deviceTokenOutput = document.getElementById('deviceTokenOutput');
const copyDeviceTokenButton = document.getElementById('copyDeviceTokenButton');

const refreshDevicesButton = document.getElementById('refreshDevicesButton');
const devicesList = document.getElementById('devicesList');

const clinicReportForm = document.getElementById('clinicReportForm');
const clinicReportType = document.getElementById('clinicReportType');
const clinicReportFrom = document.getElementById('clinicReportFrom');
const clinicReportTo = document.getElementById('clinicReportTo');
const clinicReportMessage = document.getElementById('clinicReportMessage');
const clinicReportResults = document.getElementById('clinicReportResults');
const runClinicReportButton = document.getElementById('runClinicReportButton');
const exportClinicReportButton = document.getElementById('exportClinicReportButton');

// QR Pet Identification elements
const qrCameraVideo = document.getElementById('qrCameraVideo');
const qrScannerCanvas = document.getElementById('qrScannerCanvas');
const qrScannerStatus = document.getElementById('qrScannerStatus');
const qrScanAnotherButton = document.getElementById('qrScanAnotherButton');

const qrPetProfilePanel = document.getElementById('qrPetProfilePanel');
const qrPetPhoto = document.getElementById('qrPetPhoto');
const qrPetName = document.getElementById('qrPetName');
const qrPetCode = document.getElementById('qrPetCode');
const qrPetSpecies = document.getElementById('qrPetSpecies');
const qrPetBreed = document.getElementById('qrPetBreed');
const qrPetSex = document.getElementById('qrPetSex');
const qrPetDateOfBirth = document.getElementById('qrPetDateOfBirth');
const qrPetColor = document.getElementById('qrPetColor');
const qrPetOwnerName = document.getElementById('qrPetOwnerName');
const qrPetStatusBadge = document.getElementById('qrPetStatusBadge');

// QR Owner Details modal
const qrOwnerDetailsButton = document.getElementById('qrOwnerDetailsButton');
const qrOwnerDetailsDialog = document.getElementById('qrOwnerDetailsDialog');

// QR Vaccination Record modal
const qrAddVaccinationButton = document.getElementById(
    'qrAddVaccinationButton'
);
const qrVaccinationRecordDialog = document.getElementById(
    'qrVaccinationRecordDialog'
);
const qrVaccinationForm = document.getElementById('qrVaccinationForm');
const qrVaccinationPetName = document.getElementById('qrVaccinationPetName');
const qrVaccinationMessage = document.getElementById('qrVaccinationMessage');
const qrSaveVaccinationButton = document.getElementById(
    'qrSaveVaccinationButton'
);

// QR Vaccination History modal
const qrVaccinationHistoryButton = document.getElementById(
    'qrVaccinationHistoryButton'
);
const qrVaccinationHistoryDialog = document.getElementById(
    'qrVaccinationHistoryDialog'
);
const qrHistoryPetName = document.getElementById('qrHistoryPetName');
const qrVaccinationHistoryList = document.getElementById(
    'qrVaccinationHistoryList'
);

const qrOwnerName = document.getElementById('qrOwnerName');
const qrOwnerEmail = document.getElementById('qrOwnerEmail');
const qrOwnerPhone = document.getElementById('qrOwnerPhone');
const qrOwnerDateOfBirth = document.getElementById('qrOwnerDateOfBirth');
const qrOwnerGender = document.getElementById('qrOwnerGender');
const qrOwnerCivilStatus = document.getElementById('qrOwnerCivilStatus');
const qrOwnerNationality = document.getElementById('qrOwnerNationality');
const qrOwnerGovId = document.getElementById('qrOwnerGovId');
const qrOwnerOccupation = document.getElementById('qrOwnerOccupation');
const qrOwnerAddress = document.getElementById('qrOwnerAddress');
const qrOwnerPermanentAddress = document.getElementById('qrOwnerPermanentAddress');
const qrOwnerMailButton = document.getElementById('qrOwnerMailButton');
const qrOwnerPhoto = document.getElementById('qrOwnerPhoto');
const qrOwnerPhotoPlaceholder = document.getElementById('qrOwnerPhotoPlaceholder');

if (qrOwnerMailButton) {
    qrOwnerMailButton.addEventListener('click', () => {
        const email = (qrOwnerEmail?.textContent || '').trim();
        if (email && email !== 'Not provided') {
            window.location.href = `mailto:${email}`;
        }
    });
}



let qrCameraStream = null;
let qrAnimationFrameId = null;
let qrScanBusy = false;
let currentQrPet = null;
let qrPetPhotoObjectUrl = null;

const deviceManagementMessage = document.getElementById('deviceManagementMessage');

const refreshApprovedPetsButton = document.getElementById(
    'refreshApprovedPetsButton'
);
const refreshHistoryButton = document.getElementById('refreshHistoryButton');
const saveVaccinationButton = document.getElementById(
    'saveVaccinationButton'
);

const administeredDateInput = document.getElementById('administeredDate');
const nextDueDateInput = document.getElementById('nextDueDate');

const navigationButtons = document.querySelectorAll('.nav-item[data-view]');
const quickActionButtons = document.querySelectorAll('[data-view-target]');

const views = {
    overview: document.getElementById('overviewSection'),
    pending: document.getElementById('pendingSection'),
    vaccinations: document.getElementById('vaccinationSection'),
    feedingEvents: document.getElementById('feedingEventsSection'),
    qrScanner: document.getElementById('qrScannerSection'),
    devices: document.getElementById('devicesSection'),
    reports: document.getElementById('reportsSection'),
    userManagement: document.getElementById('userManagementSection'),
    settings: document.getElementById('settingsSection'),
    deviceRegistry: document.getElementById('deviceRegistrySection'),
    auditLogs: document.getElementById('auditLogsSection')
};

let dashboardReady = false;
let approvedPets = [];

/** Returns the stored SmartVet session token, or an empty value when signed out. */
function getToken() {
    return SmartVetSession.getToken();
}

/** Clears the stored session and redirects the browser to the clinic login page. */
function logout() {
    SmartVetSession.clear();
    window.location.replace('/clinic/login.html');
}

/** Writes a message into an element and applies a message-type class; no-op when the element is missing. */
function showMessage(element, message, type = '') {
    if (!element) return;

    element.textContent = message;
    element.className = `message ${type}`.trim();
}

/** Performs an authenticated fetch against the clinic API, attaches the bearer token, logs out on a 401, and throws the first field error or server message on failure. */
async function apiRequest(url, options = {}) {
    const token = getToken();

    if (!token) {
        logout();
        throw new Error('Your session has expired. Please sign in again.');
    }

    const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    let data = {};

    try {
        data = await response.json();
    } catch {
        // Report a readable error if the server response is not JSON.
    }

    if (response.status === 401) {
        logout();
        throw new Error('Your session has expired. Please sign in again.');
    }

    if (!response.ok || data.success === false) {
        // Validation failures carry per-field messages; show the first one
        // instead of the generic summary so the problem is obvious.
        const fieldError = Array.isArray(data.errors) ? data.errors[0] : null;

        throw new Error(
            (fieldError && fieldError.message) ||
                data.message ||
                `Request failed (${response.status}).`
        );
    }

    return data;
}

/** Creates an element with the given tag and text, optionally assigns a class, appends it to parent, and returns it. */
function addText(parent, tag, text, className = '') {
    const element = document.createElement(tag);
    element.textContent = text;

    if (className) {
        element.className = className;
    }

    parent.appendChild(element);
    return element;
}

/** Creates a type="button" button with a label, class, and click handler, and returns it. */
function createButton(label, className, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.className = className;
    button.addEventListener('click', onClick);
    return button;
}

/** Formats a date value for display, returning "Not provided" for empty values and "Not available" for invalid dates. */
function formatDate(value) {
    if (!value) return 'Not provided';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    return date.toLocaleDateString();
    
}

/** Formats a timestamp in Asia/Manila time, returning "Not recorded" for empty values and "Not available" for invalid dates. */
function formatDateTime(value) {
    if (!value) return 'Not recorded';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    return date.toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

/** Returns a Date as a local YYYY-MM-DD string, defaulting to today. */
function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/** Rebuilds the device form's pet dropdown from approvedPets, preserving the previous selection when it still exists. */
function populateDevicePetOptions() {
    if (!devicePetSelect) return;

    const previousPetId = devicePetSelect.value;

    devicePetSelect.replaceChildren();

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'No pet assigned';
    devicePetSelect.appendChild(placeholder);

    approvedPets.forEach((pet) => {
        const option = document.createElement('option');

        option.value = pet.id;
        option.textContent =
            `${pet.petCode || 'No Pet ID'} — ${pet.name} (${pet.species})`;

        devicePetSelect.appendChild(option);
    });

    if (approvedPets.some((pet) => pet.id === previousPetId)) {
        devicePetSelect.value = previousPetId;
    }
}

/* Sidebar navigation */


/** Shows the requested dashboard section, updates the sidebar active state, and lazy-loads (or stops) the data each view needs. */
function switchView(viewName) {
    if (!views[viewName]) return;

    // Show the selected section and hide the others.
    Object.entries(views).forEach(([name, section]) => {
        const isActive = name === viewName;

        section.hidden = !isActive;
        section.classList.toggle('is-active', isActive);
    });

    // Update the sidebar's selected navigation item.
    navigationButtons.forEach((button) => {
        const isActive = button.dataset.view === viewName;

        button.classList.toggle('active', isActive);

        if (isActive) {
            button.setAttribute('aria-current', 'page');
        } else {
            button.removeAttribute('aria-current');
        }
    });

    // Load the appropriate records when opening a section.
    if (!dashboardReady) return;

    // Start the scanner when its workspace opens.
    // Stop the camera when the user leaves the workspace.
    if (viewName === 'qrScanner') {
        startQrScanner();
    } else {
        stopQrScanner();
    }

    if (viewName === 'pending') {
        loadPendingPets();
    }

    if (viewName === 'vaccinations') {
        if (approvedPets.length === 0) {
            loadApprovedPets();
        } else {
            loadVaccinationHistory(approvedPetSelect.value);
        }
    }

    if (viewName === 'feedingEvents') {
    loadFeedingEvents();
}


if (viewName === 'devices') {
    populateDevicePetOptions();
    loadDevices();
}

    if (viewName === 'reports') {
        loadClinicReport();
    }

    if (viewName === 'userManagement') {
        loadVeterinaryUsers();
    }

    if (viewName === 'settings') {
        loadSystemSettings();
    }

    if (viewName === 'deviceRegistry') {
        loadDeviceRegistry();
    }

    if (viewName === 'auditLogs') {
        loadAuditLogs();
    }

}


navigationButtons.forEach((button) => {
    button.addEventListener('click', () => {
        switchView(button.dataset.view);
    });
});

quickActionButtons.forEach((button) => {
    button.addEventListener('click', () => {
        switchView(button.dataset.viewTarget);
    });
});

/* Overview statistics */

/** Updates the pending-registration counter when its element exists. */
function updatePendingCount(count) {
    if (pendingCount) {
        pendingCount.textContent = String(count);
    }
}

/** Updates the approved-pet counter text. */
function updateApprovedCount(count) {
    approvedCount.textContent = String(count);
}

/**
 * Draw the overall vaccination status ring: one slice per category sized as a
 * share of every registered pet, with the total centred and counts in the legend.
 */
function renderVaccinationStatusDonut(status) {
    if (!vaccinationStatusDonut) return;

    const slices = [
        { key: 'upToDate', color: '#0e8a66' },
        { key: 'dueSoon', color: '#f0b429' },
        { key: 'overdue', color: '#c9384f' }
    ];

    const total = Number(status?.total) || 0;
    const values = {
        upToDate: Number(status?.upToDate) || 0,
        dueSoon: Number(status?.dueSoon) || 0,
        overdue: Number(status?.overdue) || 0
    };

    // Drop the previous render's segments, keeping the track and title nodes.
    vaccinationStatusDonut.querySelectorAll('circle.donut-slice').forEach(
        (node) => node.remove()
    );

    let cursor = 0;

    slices.forEach((slice) => {
        const percent = total > 0 ? (values[slice.key] / total) * 100 : 0;

        if (percent <= 0) return;

        const circle = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'circle'
        );

        circle.setAttribute('class', 'donut-slice');
        circle.setAttribute('cx', '21');
        circle.setAttribute('cy', '21');
        circle.setAttribute('r', '15.9155');
        circle.setAttribute('fill', 'transparent');
        circle.setAttribute('stroke', slice.color);

        // The radius makes the circumference 100 units, so a slice length is
        // simply its percentage; the offset walks each slice around the ring.
        circle.setAttribute('stroke-dasharray', `${percent} ${100 - percent}`);
        circle.setAttribute('stroke-dashoffset', String(100 - cursor + 25));

        vaccinationStatusDonut.appendChild(circle);
        cursor += percent;
    });

    vaccinationStatusTotal.textContent = String(total);
    vaccinationStatusUpToDate.textContent = String(values.upToDate);
    vaccinationStatusDueSoon.textContent = String(values.dueSoon);
    vaccinationStatusOverdue.textContent = String(values.overdue);
}

/**
 * Draw the monthly new-registration line chart from the trend payload: the
 * y-axis scales to the busiest month, every month is labelled (including empty
 * ones), and each point carries its exact count.
 */
function renderRegistrationTrendChart(trend) {
    if (!registrationTrendChart) return;

    const points = Array.isArray(trend) ? trend : [];
    const counts = points.map((point) => Number(point.count) || 0);
    const total = counts.reduce((sum, count) => sum + count, 0);

    if (points.length === 0) {
        registrationTrendChart.innerHTML = '';
        if (registrationTrendSummary) {
            registrationTrendSummary.textContent = 'No registration data yet.';
        }
        return;
    }

    const width = 320;
    const height = 200;
    const pad = { top: 26, right: 14, bottom: 26, left: 30 };
    const plotWidth = width - pad.left - pad.right;
    const plotHeight = height - pad.top - pad.bottom;

    const rawMax = Math.max(...counts);
    // Keep every gridline on a whole number: four steps of an even size.
    const step = rawMax <= 4 ? 1 : Math.ceil(rawMax / 4);
    const yMax = step * 4;

    const xAt = (index) => (
        points.length > 1
            ? pad.left + (plotWidth / (points.length - 1)) * index
            : pad.left + plotWidth / 2
    );
    const yAt = (value) =>
        pad.top + plotHeight - (value / yMax) * plotHeight;

    const parts = [
        '<title id="registrationTrendChartTitle">',
        'Line chart of new pet registrations per month',
        '</title>'
    ];

    // Horizontal gridlines plus their value labels.
    for (let tick = 0; tick <= 4; tick += 1) {
        const value = step * tick;
        const y = yAt(value);

        parts.push(
            `<line class="line-grid" x1="${pad.left}" y1="${y}"` +
            ` x2="${width - pad.right}" y2="${y}"></line>`
        );
        parts.push(
            `<text class="line-axis-label" x="${pad.left - 8}" y="${y + 3}"` +
            ` text-anchor="end">${value}</text>`
        );
    }

    const coordinates = points.map((_point, index) => ({
        x: xAt(index),
        y: yAt(counts[index])
    }));

    const linePath = coordinates
        .map((coord, index) => `${index === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`)
        .join(' ');

    if (coordinates.length > 1) {
        const areaPath = `${linePath}` +
            ` L ${coordinates[coordinates.length - 1].x} ${yAt(0)}` +
            ` L ${coordinates[0].x} ${yAt(0)} Z`;

        parts.push(`<path class="line-area" d="${areaPath}"></path>`);
    }

    parts.push(`<path class="line-path" d="${linePath}"></path>`);

    coordinates.forEach((coord, index) => {
        parts.push(
            `<circle class="line-point" cx="${coord.x}" cy="${coord.y}" r="3.5"></circle>`
        );
        parts.push(
            `<text class="line-value" x="${coord.x}" y="${coord.y - 9}"` +
            ` text-anchor="middle">${counts[index]}</text>`
        );
        parts.push(
            `<text class="line-axis-label" x="${coord.x}" y="${height - 8}"` +
            ` text-anchor="middle">${points[index].label}</text>`
        );
    });

    registrationTrendChart.innerHTML = parts.join('');

    if (registrationTrendSummary) {
        const peakIndex = counts.indexOf(rawMax);

        registrationTrendSummary.textContent =
            `${total} new registration${total === 1 ? '' : 's'} in the last six months` +
            ` · busiest month: ${points[peakIndex].label} (${rawMax}).`;
    }
}

/** Fetches dashboard summary counts and writes them into the overview stat elements; logs failures to the console. */
async function loadDashboardOverview() {
    if (!dashboardReady) return;

    try {
        const data = await apiRequest('/api/clinic/dashboard-overview');

        if (!data || !data.summary) {
            throw new Error('The dashboard overview data is unavailable.');
        }

        registeredPetsCount.textContent =
            String(data.summary.registeredPets ?? 0);

        pendingCount.textContent =
            String(data.summary.pendingReview ?? 0);

        overdueVaccineCount.textContent =
            String(data.summary.overdueVaccines ?? 0);

        dueSoonVaccineCount.textContent =
            String(data.summary.dueSoonVaccines ?? 0);

        renderVaccinationStatusDonut(data.summary.vaccinationStatus);
        renderRegistrationTrendChart(data.summary.registrationTrend);
    } catch (error) {
        console.error('Unable to load clinic dashboard overview:', error);
    }
}

/* Pending registrations */

/** Builds a pending-registration card (photo, details, owner, status, and approve/verify actions) and returns the article element. */
function createPetCard(pet) {
    const card = document.createElement('article');
    card.className = 'pet-card';

    if (pet.hasPhoto) {
    const photo = document.createElement('img');

    photo.className = 'pending-pet-photo';
    photo.alt = `${pet.name || 'Pet'} photo`;
    photo.loading = 'lazy';

    const token = getToken();

    fetch(`/api/clinic/pets/${encodeURIComponent(pet.id)}/photo`, {
        headers: {
            Accept: 'image/jpeg, image/png, image/webp',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to load pet photo.');
            }

            return response.blob();
        })
        .then(blob => {
            photo.src = URL.createObjectURL(blob);
        })
        .catch(() => {
            photo.alt = 'Pet photo unavailable';
            photo.classList.add('pet-photo-unavailable');
        });

    card.appendChild(photo);
}

    addText(card, 'h3', pet.name || 'Unnamed pet');
    addText(card, 'p', `Species: ${pet.species || 'Not provided'}`);
    addText(card, 'p', `Breed: ${pet.breed || 'Not provided'}`);
    addText(card, 'p', `Sex: ${pet.sex || 'Not provided'}`);
    addText(card, 'p', `Date of birth: ${formatDate(pet.dateOfBirth)}`);
    addText(card, 'p', `Color: ${pet.color || 'Not provided'}`);

    const owner = pet.owner || pet.ownerUserId;

    if (owner && typeof owner === 'object') {
        addText(card, 'p', `Owner: ${owner.fullName || 'Not available'}`);
        addText(card, 'p', `Owner email: ${owner.email || 'Not available'}`);
    } else {
        addText(card, 'p', 'Owner information is unavailable.');
    }

    const status = addText(
        card,
        'span',
        pet.registrationStatus || 'pending',
        'status'
    );

    status.setAttribute('aria-label', 'Registration status');

    const actions = document.createElement('div');
    actions.className = 'pet-actions';

    actions.appendChild(
        createButton(
            'Approve registration',
            'primary',
            () => approvePet(pet.id, actions)
        )
    );

    actions.appendChild(
        createButton(
            'Needs verification',
            'warning',
            () => requestVerification(pet.id, actions)
        )
    );

    actions.appendChild(
        createButton(
            'View Owner Details',
            'secondary',
            () => openQrOwnerDetails(pet)
        )
    );

    card.appendChild(actions);
    return card;
}

/** Fetches pending registrations, renders their cards, updates the pending count, and shows loading and error messages. */
async function loadPendingPets() {
    if (!dashboardReady) return;

    refreshButton.disabled = true;
    petList.replaceChildren();

    showMessage(listMessage, 'Loading pending registrations...');

    try {
        const data = await apiRequest('/api/clinic/pets/pending');
        const pets = Array.isArray(data.pets) ? data.pets : [];

        updatePendingCount(pets.length);

        if (pets.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty';
            empty.textContent = 'There are no pending registrations right now.';
            petList.appendChild(empty);

            showMessage(listMessage, 'List updated.', 'success');
            return;
        }

        const fragment = document.createDocumentFragment();

        pets.forEach((pet) => {
            fragment.appendChild(createPetCard(pet));
        });

        petList.appendChild(fragment);

        showMessage(
            listMessage,
            `${pets.length} pending registration(s) found.`,
            'success'
        );
    } catch (error) {
        showMessage(
            listMessage,
            error.message || 'Unable to load registrations.',
            'error'
        );
    } finally {
        refreshButton.disabled = false;
    }
}

/** Confirms, then approves a registration via PATCH, shows the returned Pet ID/QR result, and reloads the pending and approved lists. */
async function approvePet(petId, actionsContainer) {
    const confirmed = window.confirm(
        'Approve this pet registration? This will generate an official Pet ID and QR code.'
    );

    if (!confirmed) return;

    const buttons = actionsContainer.querySelectorAll('button');
    buttons.forEach((button) => {
        button.disabled = true;
    });

    try {
        const data = await apiRequest(
            `/api/clinic/pets/${encodeURIComponent(petId)}/approve`,
            {
                method: 'PATCH',
                body: JSON.stringify({ notes: '' })
            }
        );

        showMessage(
            listMessage,
            'Registration approved successfully. The Pet ID and QR code are shown below.',
            'success'
        );

        showApprovalResult(data);

        await loadPendingPets();
        await loadApprovedPets();
    } catch (error) {
        showMessage(
            listMessage,
            error.message || 'Unable to approve this registration.',
            'error'
        );

        buttons.forEach((button) => {
            button.disabled = false;
        });
    }
}

/** Prompts for a reason and PATCHes the registration into the needs-verification state, then reloads the pending list. */
async function requestVerification(petId, actionsContainer) {
    const reason = window.prompt(
        'Explain why this registration needs verification:'
    );

    if (reason === null) return;

    if (!reason.trim()) {
        showMessage(listMessage, 'Please provide a reason.', 'error');
        return;
    }

    const buttons = actionsContainer.querySelectorAll('button');
    buttons.forEach((button) => {
        button.disabled = true;
    });

    try {
        await apiRequest(
            `/api/clinic/pets/${encodeURIComponent(petId)}/needs-verification`,
            {
                method: 'PATCH',
                body: JSON.stringify({ reason: reason.trim() })
            }
        );

        showMessage(
            listMessage,
            'The registration was marked for additional verification.',
            'success'
        );

        await loadPendingPets();
    } catch (error) {
        showMessage(
            listMessage,
            error.message || 'Unable to update this registration.',
            'error'
        );

        buttons.forEach((button) => {
            button.disabled = false;
        });
    }
}

/** Renders the approval-result panel with the official Pet ID and, when present, a downloadable QR code image. */
function showApprovalResult(data) {
    const pet = data.pet || data;

    const petCode = pet.petCode || data.petCode || 'Not available';
    const petName = pet.name || data.name || 'Pet';
    const qrImage = pet.qrCodeImage || data.qrCodeImage;

    const panel = document.createElement('section');
    panel.className = 'approval-result workspace-panel';

    addText(panel, 'h2', 'Registration Approved');
    addText(panel, 'p', `Official Pet ID: ${petCode}`);
    addText(panel, 'p', `Pet: ${petName}`);

    if (
        typeof qrImage === 'string' &&
        qrImage.startsWith('data:image/png;base64,')
    ) {
        const qrPanel = document.createElement('div');
        qrPanel.className = 'qr-panel';

        addText(qrPanel, 'h3', 'Pet QR Code');
        addText(
            qrPanel,
            'p',
            'This QR code identifies the approved pet record.'
        );

        const image = document.createElement('img');
        image.src = qrImage;
        image.alt = `QR code for ${petName}`;
        qrPanel.appendChild(image);

        const download = document.createElement('a');
        download.href = qrImage;
        download.download = `${petCode}-QR.png`;
        download.textContent = 'Download QR code';
        qrPanel.appendChild(download);

        panel.appendChild(qrPanel);
    } else {
        addText(
            panel,
            'p',
            'The pet was approved, but the QR image was not found in the response.',
            'muted'
        );
    }

    approvalResultContainer.replaceChildren(panel);
}

/* Approved pets */

/** Updates the approved-pet detail line for the currently selected pet, or prompts the user to select one. */
function updateSelectedPetInfo() {
    const pet = approvedPets.find(
        (item) => item.id === approvedPetSelect.value
    );

    if (!pet) {
        selectedPetInfo.textContent =
            'Select an approved pet to view its details.';
        return;
    }

    selectedPetInfo.textContent =
        `${pet.petCode || 'No Pet ID'} — ${pet.name} (${pet.species}). ` +
        `Owner: ${pet.owner?.fullName || 'Unavailable'}.`;
}

/** Fetches approved pets, rebuilds the selection dropdown while preserving the prior selection, and loads the selected pet's vaccination history. */
async function loadApprovedPets() {
    if (!dashboardReady) return;

    const previousPetId = approvedPetSelect.value;

    refreshApprovedPetsButton.disabled = true;
    approvedPetSelect.disabled = true;

    try {
        const data = await apiRequest('/api/clinic/pets/approved');
        approvedPets = Array.isArray(data.pets) ? data.pets : [];

        updateApprovedCount(approvedPets.length);
        approvedPetSelect.replaceChildren();

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = approvedPets.length
            ? 'Select an approved pet'
            : 'No approved pets available';

        approvedPetSelect.appendChild(placeholder);

        approvedPets.forEach((pet) => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent =
                `${pet.petCode || 'No Pet ID'} — ${pet.name} (${pet.species})`;

            approvedPetSelect.appendChild(option);
        });

        if (approvedPets.some((pet) => pet.id === previousPetId)) {
            approvedPetSelect.value = previousPetId;
        } else if (approvedPets.length > 0) {
            approvedPetSelect.value = approvedPets[0].id;
        }

        approvedPetSelect.disabled = approvedPets.length === 0;
        updateSelectedPetInfo();

        await loadVaccinationHistory(approvedPetSelect.value);

        if (approvedPets.length === 0) {
            showMessage(
                vaccinationMessage,
                'No approved pets are available for vaccination recording.',
                ''
            );
        } else {
            showMessage(
                vaccinationMessage,
                `${approvedPets.length} approved pet(s) loaded.`,
                'success'
            );
        }
    } catch (error) {
        approvedPets = [];
        approvedPetSelect.replaceChildren();

        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Unable to load approved pets';
        approvedPetSelect.appendChild(option);

        approvedPetSelect.disabled = true;
        updateApprovedCount('—');
        updateSelectedPetInfo();

        vaccinationHistory.replaceChildren();
        addText(
            vaccinationHistory,
            'p',
            error.message || 'Unable to load approved pets.',
            'error'
        );

        showMessage(
            vaccinationMessage,
            error.message || 'Unable to load approved pets.',
            'error'
        );
    } finally {
        refreshApprovedPetsButton.disabled = false;
    }
}

/* Vaccination history */

/** Fetches and renders vaccination cards for the given approved pet, with empty, loading, and error states. */
async function loadVaccinationHistory(petId) {
    vaccinationHistory.replaceChildren();

    if (!petId) {
        addText(
            vaccinationHistory,
            'p',
            'Select an approved pet to view its history.',
            'muted'
        );
        refreshHistoryButton.disabled = false;
        return;
    }

    refreshHistoryButton.disabled = true;

    addText(
        vaccinationHistory,
        'p',
        'Loading vaccination history...',
        'muted'
    );

    try {
        const data = await apiRequest(
            `/api/clinic/pets/${encodeURIComponent(petId)}/vaccinations`
        );

        const records = Array.isArray(data.vaccinations)
            ? data.vaccinations
            : [];

        vaccinationHistory.replaceChildren();

        if (records.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty';
            empty.textContent =
                'No vaccination records have been entered for this pet.';
            vaccinationHistory.appendChild(empty);
            return;
        }

        addText(
            vaccinationHistory,
            'p',
            `${records.length} vaccination record(s) found.`,
            'muted'
        );

        records.forEach((record) => {
            const card = document.createElement('article');
            card.className = 'history-card';

            addText(card, 'h4', record.vaccineName || 'Unnamed vaccine');
            addText(
                card,
                'p',
                `Date administered: ${formatDate(record.administeredDate)}`
            );
            addText(
                card,
                'p',
                `Next due date: ${formatDate(record.nextDueDate)}`
            );
            addText(
                card,
                'p',
                `Batch/lot number: ${record.batchNumber || 'Not provided'}`
            );
            addText(
                card,
                'p',
                `Manufacturer: ${record.manufacturer || 'Not provided'}`
            );
            addText(
                card,
                'p',
                `Dosage: ${record.dosage || 'Not provided'}`
            );
            addText(
                card,
                'p',
                `Recorded by: ${record.administeredBy || 'Unknown'}`
            );

            if (record.notes) {
                addText(card, 'p', `Notes: ${record.notes}`);
            }

            vaccinationHistory.appendChild(card);
        });
    } catch (error) {
        vaccinationHistory.replaceChildren();

        addText(
            vaccinationHistory,
            'p',
            error.message || 'Unable to load vaccination history.',
            'error'
        );
    } finally {
        refreshHistoryButton.disabled = false;
    }
}

/* Vaccination form submission */

vaccinationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const petId = approvedPetSelect.value;

    if (!petId) {
        showMessage(
            vaccinationMessage,
            'Please select an approved pet first.',
            'error'
        );
        return;
    }

    const administeredDate = administeredDateInput.value;
    const nextDueDate = nextDueDateInput.value;

    if (nextDueDate && nextDueDate < administeredDate) {
        showMessage(
            vaccinationMessage,
            'The next due date cannot be earlier than the administration date.',
            'error'
        );
        nextDueDateInput.focus();
        return;
    }

    const payload = {
        vaccineName: document.getElementById('vaccineName').value.trim(),
        administeredDate,
        batchNumber: document.getElementById('batchNumber').value.trim(),
        manufacturer: document.getElementById('manufacturer').value.trim(),
        dosage: document.getElementById('dosage').value.trim(),
        notes: document.getElementById('vaccinationNotes').value.trim()
    };

    if (nextDueDate) {
        payload.nextDueDate = nextDueDate;
    }

    saveVaccinationButton.disabled = true;
    saveVaccinationButton.textContent = 'Saving...';

    try {
        const data = await apiRequest(
            `/api/clinic/pets/${encodeURIComponent(petId)}/vaccinations`,
            {
                method: 'POST',
                body: JSON.stringify(payload)
            }
        );

        showMessage(
            vaccinationMessage,
            data.message || 'Vaccination record saved successfully.',
            'success'
        );

        vaccinationForm.reset();

        administeredDateInput.max = localDateString();
        nextDueDateInput.min = '';

        await loadVaccinationHistory(petId);
    } catch (error) {
        showMessage(
            vaccinationMessage,
            error.message || 'Unable to save the vaccination record.',
            'error'
        );
    } finally {
        saveVaccinationButton.disabled = false;
        saveVaccinationButton.textContent = 'Save Vaccination';
    }
});

approvedPetSelect.addEventListener('change', async () => {
    updateSelectedPetInfo();
    await loadVaccinationHistory(approvedPetSelect.value);
});

refreshApprovedPetsButton.addEventListener('click', loadApprovedPets);

refreshHistoryButton.addEventListener('click', () => {
    loadVaccinationHistory(approvedPetSelect.value);
});

administeredDateInput.max = localDateString();

administeredDateInput.addEventListener('change', () => {
    nextDueDateInput.min = administeredDateInput.value || '';
});

/* Session verification */


/* Feeding event history */

/* Device Management: load registered devices */

/** Fetches registered devices and renders detail cards with pet-assignment and status controls; assignment and status changes are only enabled for active devices. */
async function loadDevices() {
    if (!dashboardReady || !devicesList) return;

    devicesList.replaceChildren();
    devicesList.setAttribute('aria-busy', 'true');

    if (deviceManagementMessage) {
        deviceManagementMessage.textContent = '';
    }

    const loadingMessage = document.createElement('p');
    loadingMessage.className = 'muted';
    loadingMessage.textContent = 'Loading registered devices...';
    devicesList.appendChild(loadingMessage);

    if (refreshDevicesButton) {
        refreshDevicesButton.disabled = true;
    }

    try {
        const data = await apiRequest('/api/clinic/devices');
        const devices = Array.isArray(data.devices) ? data.devices : [];

        devicesList.replaceChildren();

        if (devices.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'muted';
            emptyMessage.textContent = 'No registered devices found.';
            devicesList.appendChild(emptyMessage);
            return;
        }

        devices.forEach((device) => {
            const card = document.createElement('article');
            card.className = 'device-list-item';

            const heading = document.createElement('div');
            heading.className = 'device-list-heading';

            const title = document.createElement('h3');
            title.textContent = device.deviceCode || 'Unnamed device';

            const status = document.createElement('span');
            status.className = `device-status device-status-${device.status}`;
            status.textContent = device.status || 'Unknown';

            heading.append(title, status);
            card.appendChild(heading);

            /** Appends a labelled detail paragraph (strong label plus value span) to a device card. */
            function addDetail(label, value) {
                const paragraph = document.createElement('p');
                paragraph.className = 'device-detail';

                const labelElement = document.createElement('strong');
                labelElement.textContent = `${label}: `;

                const valueElement = document.createElement('span');
                valueElement.textContent = value || 'Not provided';

                paragraph.append(labelElement, valueElement);
                card.appendChild(paragraph);
            }

            const typeLabel = device.deviceType === 'feeder'
                ? 'Automatic Feeder'
                : device.deviceType === 'collar'
                    ? 'Activity Monitoring Collar'
                    : device.deviceType || 'Unknown';

            addDetail('Device type', typeLabel);

            const assignedPet = device.pet
                ? `${device.pet.name || 'Unnamed pet'} (${device.pet.petCode || 'No pet code'})`
                : 'Unassigned';

            addDetail('Assigned pet', assignedPet);
            addDetail('Firmware version', device.firmwareVersion);
            addDetail('Description', device.description);

            addDetail(
                'Registered by',
                device.registeredBy?.fullName || 'Unknown'
            );

            addDetail(
                'Date registered',
                device.createdAt
                    ? new Date(device.createdAt).toLocaleString()
                    : 'Unknown'
            );

            addDetail(
                'Last activity',
                device.lastSeenAt
                    ? new Date(device.lastSeenAt).toLocaleString()
                    : 'No activity reported'
            );

            // Device assignment controls
            const assignmentPanel = document.createElement('div');
            assignmentPanel.className = 'device-card-actions';

            const assignmentLabel = document.createElement('label');
            assignmentLabel.textContent = 'Assign to approved pet';

            const assignmentSelect = document.createElement('select');
            assignmentSelect.setAttribute(
                'aria-label',
                `Assign pet to device ${device.deviceCode}`
            );

            const unassignedOption = document.createElement('option');
            unassignedOption.value = '';
            unassignedOption.textContent = 'Unassigned';
            assignmentSelect.appendChild(unassignedOption);

            approvedPets.forEach((pet) => {
                const option = document.createElement('option');
                option.value = pet.id;
                option.textContent =
                    `${pet.petCode || 'No Pet ID'} — ${pet.name} (${pet.species})`;

                if (device.pet && device.pet.id === pet.id) {
                    option.selected = true;
                }

                assignmentSelect.appendChild(option);
            });

            const saveAssignmentButton = document.createElement('button');
            saveAssignmentButton.type = 'button';
            saveAssignmentButton.className = 'secondary';
            saveAssignmentButton.textContent = 'Save Assignment';

            const assignmentIsAllowed = device.status === 'active';
            assignmentSelect.disabled = !assignmentIsAllowed;
            saveAssignmentButton.disabled = !assignmentIsAllowed;

            saveAssignmentButton.addEventListener('click', async () => {
                saveAssignmentButton.disabled = true;

                try {
                    const result = await apiRequest(
                        `/api/clinic/devices/${encodeURIComponent(device.id)}/assignment`,
                        {
                            method: 'PATCH',
                            body: JSON.stringify({
                                petId: assignmentSelect.value || null
                            })
                        }
                    );

                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            result.message || 'Device assignment updated.';
                    }

                    await loadDevices();
                } catch (error) {
                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            `Unable to update assignment: ${error.message}`;
                    }

                    saveAssignmentButton.disabled = !assignmentIsAllowed;
                }
            });

            assignmentPanel.append(
                assignmentLabel,
                assignmentSelect,
                saveAssignmentButton
            );

            card.appendChild(assignmentPanel);

            // Device status controls
            const statusPanel = document.createElement('div');
            statusPanel.className = 'device-card-actions';

            const statusLabel = document.createElement('label');
            statusLabel.textContent = 'Device status';

            const statusSelect = document.createElement('select');
            statusSelect.setAttribute(
                'aria-label',
                `Change status for device ${device.deviceCode}`
            );

            const allowedStatuses = device.status === 'revoked'
                ? ['revoked']
                : ['active', 'disabled', 'revoked'];

            allowedStatuses.forEach((value) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent =
                    value.charAt(0).toUpperCase() + value.slice(1);
                option.selected = value === device.status;
                statusSelect.appendChild(option);
            });

            const updateStatusButton = document.createElement('button');
            updateStatusButton.type = 'button';
            updateStatusButton.className = 'secondary';
            updateStatusButton.textContent = 'Update Status';

            updateStatusButton.disabled = device.status === 'revoked';

            updateStatusButton.addEventListener('click', async () => {
                const newStatus = statusSelect.value;

                if (newStatus === device.status) {
                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            'The device already has that status.';
                    }
                    return;
                }

                if (device.status === 'revoked') {
                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            'Revoked devices cannot be reactivated.';
                    }
                    return;
                }

                if (newStatus === 'revoked') {
                    const confirmed = window.confirm(
                        `Permanently revoke device ${device.deviceCode}? ` +
                        'This action cannot be undone. A replacement must be registered.'
                    );

                    if (!confirmed) {
                        statusSelect.value = device.status;
                        return;
                    }
                }

                updateStatusButton.disabled = true;

                try {
                    const result = await apiRequest(
                        `/api/clinic/devices/${encodeURIComponent(device.id)}/status`,
                        {
                            method: 'PATCH',
                            body: JSON.stringify({ status: newStatus })
                        }
                    );

                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            result.message || 'Device status updated successfully.';
                    }

                    await loadDevices();
                } catch (error) {
                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            `Unable to update device status: ${error.message}`;
                    }

                    updateStatusButton.disabled = false;
                }
            });

            statusPanel.append(
                statusLabel,
                statusSelect,
                updateStatusButton
            );

            card.appendChild(statusPanel);

            devicesList.appendChild(card);
        });
    } catch (error) {
        devicesList.replaceChildren();

        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent =
            `Unable to load devices: ${error.message}`;

        devicesList.appendChild(errorMessage);
    } finally {
        devicesList.setAttribute('aria-busy', 'false');

        if (refreshDevicesButton) {
            refreshDevicesButton.disabled = false;
        }
    }
}

/* Device Management: register a
/* Device Management: load registered devices */

/** Fetches registered devices and renders detail cards with pet-assignment and status controls; assignment and status changes are only enabled for active devices. */
async function loadDevices() {
    if (!dashboardReady || !devicesList) return;

    devicesList.replaceChildren();
    devicesList.setAttribute('aria-busy', 'true');

    if (deviceManagementMessage) {
        deviceManagementMessage.textContent = '';
    }

    const loadingMessage = document.createElement('p');
    loadingMessage.className = 'muted';
    loadingMessage.textContent = 'Loading registered devices...';
    devicesList.appendChild(loadingMessage);

    if (refreshDevicesButton) {
        refreshDevicesButton.disabled = true;
    }

    try {
        const data = await apiRequest('/api/clinic/devices');
        const devices = Array.isArray(data.devices) ? data.devices : [];

        devicesList.replaceChildren();

        if (devices.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'muted';
            emptyMessage.textContent = 'No registered devices found.';
            devicesList.appendChild(emptyMessage);
            return;
        }

        devices.forEach((device) => {
            const card = document.createElement('article');
            card.className = 'device-list-item';

            const heading = document.createElement('div');
            heading.className = 'device-list-heading';

            const title = document.createElement('h3');
            title.textContent = device.deviceCode || 'Unnamed device';

            const status = document.createElement('span');
            status.className = `device-status device-status-${device.status}`;
            status.textContent = device.status || 'Unknown';

            heading.append(title, status);
            card.appendChild(heading);

            /** Appends a labelled detail paragraph (strong label plus value span) to a device card. */
            function addDetail(label, value) {
                const paragraph = document.createElement('p');
                paragraph.className = 'device-detail';

                const labelElement = document.createElement('strong');
                labelElement.textContent = `${label}: `;

                const valueElement = document.createElement('span');
                valueElement.textContent = value || 'Not provided';

                paragraph.append(labelElement, valueElement);
                card.appendChild(paragraph);
            }

            const typeLabel = device.deviceType === 'feeder'
                ? 'Automatic Feeder'
                : device.deviceType === 'collar'
                    ? 'Activity Monitoring Collar'
                    : device.deviceType || 'Unknown';

            addDetail('Device type', typeLabel);

            const assignedPet = device.pet
                ? `${device.pet.name || 'Unnamed pet'} (${device.pet.petCode || 'No pet code'})`
                : 'Unassigned';

            addDetail('Assigned pet', assignedPet);
            addDetail('Firmware version', device.firmwareVersion);
            addDetail('Description', device.description);

            addDetail(
                'Registered by',
                device.registeredBy?.fullName || 'Unknown'
            );

            addDetail(
                'Date registered',
                device.createdAt
                    ? new Date(device.createdAt).toLocaleString()
                    : 'Unknown'
            );

            addDetail(
                'Last activity',
                device.lastSeenAt
                    ? new Date(device.lastSeenAt).toLocaleString()
                    : 'No activity reported'
            );

            // Device assignment controls
            const assignmentPanel = document.createElement('div');
            assignmentPanel.className = 'device-card-actions';

            const assignmentLabel = document.createElement('label');
            assignmentLabel.textContent = 'Assign to approved pet';

            const assignmentSelect = document.createElement('select');
            assignmentSelect.setAttribute(
                'aria-label',
                `Assign pet to device ${device.deviceCode}`
            );

            const unassignedOption = document.createElement('option');
            unassignedOption.value = '';
            unassignedOption.textContent = 'Unassigned';
            assignmentSelect.appendChild(unassignedOption);

            approvedPets.forEach((pet) => {
                const option = document.createElement('option');
                option.value = pet.id;
                option.textContent =
                    `${pet.petCode || 'No Pet ID'} — ${pet.name} (${pet.species})`;

                if (device.pet && device.pet.id === pet.id) {
                    option.selected = true;
                }

                assignmentSelect.appendChild(option);
            });

            const saveAssignmentButton = document.createElement('button');
            saveAssignmentButton.type = 'button';
            saveAssignmentButton.className = 'secondary';
            saveAssignmentButton.textContent = 'Save Assignment';

            const assignmentIsAllowed = device.status === 'active';
            assignmentSelect.disabled = !assignmentIsAllowed;
            saveAssignmentButton.disabled = !assignmentIsAllowed;

            saveAssignmentButton.addEventListener('click', async () => {
                saveAssignmentButton.disabled = true;

                try {
                    const result = await apiRequest(
                        `/api/clinic/devices/${encodeURIComponent(device.id)}/assignment`,
                        {
                            method: 'PATCH',
                            body: JSON.stringify({
                                petId: assignmentSelect.value || null
                            })
                        }
                    );

                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            result.message || 'Device assignment updated.';
                    }

                    await loadDevices();
                } catch (error) {
                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            `Unable to update assignment: ${error.message}`;
                    }

                    saveAssignmentButton.disabled = !assignmentIsAllowed;
                }
            });

            assignmentPanel.append(
                assignmentLabel,
                assignmentSelect,
                saveAssignmentButton
            );

            card.appendChild(assignmentPanel);

            // Device status controls
            const statusPanel = document.createElement('div');
            statusPanel.className = 'device-card-actions';

            const statusLabel = document.createElement('label');
            statusLabel.textContent = 'Device status';

            const statusSelect = document.createElement('select');
            statusSelect.setAttribute(
                'aria-label',
                `Change status for device ${device.deviceCode}`
            );

            const allowedStatuses = device.status === 'revoked'
                ? ['revoked']
                : ['active', 'disabled', 'revoked'];

            allowedStatuses.forEach((value) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent =
                    value.charAt(0).toUpperCase() + value.slice(1);
                option.selected = value === device.status;
                statusSelect.appendChild(option);
            });

            const updateStatusButton = document.createElement('button');
            updateStatusButton.type = 'button';
            updateStatusButton.className = 'secondary';
            updateStatusButton.textContent = 'Update Status';

            updateStatusButton.disabled = device.status === 'revoked';

            updateStatusButton.addEventListener('click', async () => {
                const newStatus = statusSelect.value;

                if (newStatus === device.status) {
                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            'The device already has that status.';
                    }
                    return;
                }

                if (device.status === 'revoked') {
                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            'Revoked devices cannot be reactivated.';
                    }
                    return;
                }

                if (newStatus === 'revoked') {
                    const confirmed = window.confirm(
                        `Permanently revoke device ${device.deviceCode}? ` +
                        'This action cannot be undone. A replacement must be registered.'
                    );

                    if (!confirmed) {
                        statusSelect.value = device.status;
                        return;
                    }
                }

                updateStatusButton.disabled = true;

                try {
                    const result = await apiRequest(
                        `/api/clinic/devices/${encodeURIComponent(device.id)}/status`,
                        {
                            method: 'PATCH',
                            body: JSON.stringify({ status: newStatus })
                        }
                    );

                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            result.message || 'Device status updated successfully.';
                    }

                    await loadDevices();
                } catch (error) {
                    if (deviceManagementMessage) {
                        deviceManagementMessage.textContent =
                            `Unable to update device status: ${error.message}`;
                    }

                    updateStatusButton.disabled = false;
                }
            });

            statusPanel.append(
                statusLabel,
                statusSelect,
                updateStatusButton
            );

            card.appendChild(statusPanel);

            devicesList.appendChild(card);
        });
    } catch (error) {
        devicesList.replaceChildren();

        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent =
            `Unable to load devices: ${error.message}`;

        devicesList.appendChild(errorMessage);
    } finally {
        devicesList.setAttribute('aria-busy', 'false');

        if (refreshDevicesButton) {
            refreshDevicesButton.disabled = false;
        }
    }
}

let clinicReportData = null;

/** Formats a report cell for display, rendering ISO-like date values as locale dates and blanks as an em dash. */
function formatReportCell(value) {
    if (value === null || value === undefined || value === '') return '—';
    const date = new Date(value);
    return !Number.isNaN(date.getTime()) &&
        /^\d{4}-\d{2}-\d{2}/.test(String(value))
        ? formatDate(value)
        : String(value);
}

/** Renders the clinic report results as a table (or a "no records" note) and flags when the server truncated the rows. */
function renderClinicReport(report) {
    if (!clinicReportResults) return;
    clinicReportResults.replaceChildren();
    if (!report.rows.length) {
        addText(clinicReportResults, 'p', 'No records match this report.', 'muted');
        return;
    }

    const table = document.createElement('table');
    table.className = 'clinic-report-table';
    const head = document.createElement('thead');
    const headingRow = document.createElement('tr');
    report.columns.forEach((column) => addText(headingRow, 'th', column));
    head.appendChild(headingRow);
    table.appendChild(head);
    const body = document.createElement('tbody');
    report.rows.forEach((row) => {
        const tableRow = document.createElement('tr');
        row.forEach((cell) => addText(tableRow, 'td', formatReportCell(cell)));
        body.appendChild(tableRow);
    });
    table.appendChild(body);
    clinicReportResults.appendChild(table);

    if (report.truncated) {
        addText(
            clinicReportResults,
            'p',
            'Showing the first 5,000 matching rows. Narrow the date range to export a complete report.',
            'muted'
        );
    }
}

/** Reads the report form filters, requests the report from the API, renders it, and keeps the data for CSV export. */
async function loadClinicReport() {
    if (!clinicReportForm) return;
    const params = new URLSearchParams({ type: clinicReportType.value });
    if (clinicReportFrom.value) params.set('from', clinicReportFrom.value);
    if (clinicReportTo.value) params.set('to', clinicReportTo.value);

    runClinicReportButton.disabled = true;
    exportClinicReportButton.disabled = true;
    showMessage(clinicReportMessage, 'Generating report...');
    clinicReportResults.replaceChildren();

    try {
        clinicReportData = await apiRequest(`/api/clinic/reports?${params}`);
        renderClinicReport(clinicReportData);
        exportClinicReportButton.disabled = false;
        showMessage(
            clinicReportMessage,
            `${clinicReportData.count} record(s) found.`,
            'success'
        );
    } catch (error) {
        clinicReportData = null;
        addText(
            clinicReportResults,
            'p',
            error.message || 'Unable to generate report.',
            'error'
        );
        showMessage(
            clinicReportMessage,
            error.message || 'Unable to generate report.',
            'error'
        );
    } finally {
        runClinicReportButton.disabled = false;
    }
}

if (clinicReportForm) {
    clinicReportForm.addEventListener('submit', (event) => {
        event.preventDefault();
        loadClinicReport();
    });
}

if (exportClinicReportButton) {
    exportClinicReportButton.addEventListener('click', () => {
        if (!clinicReportData) return;
/** Escapes a value for CSV output, doubling quotes and prefixing formula-like text with an apostrophe. */
        const escapeCsv = (value) => {
            let text = value === null || value === undefined ? '' : String(value);
            if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
            return `"${text.replace(/"/g, '""')}"`;
        };
        const lines = [
            clinicReportData.columns,
            ...clinicReportData.rows
        ].map((row) => row.map(escapeCsv).join(','));
        const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], {
            type: 'text/csv;charset=utf-8'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download =
            `smartvet-${clinicReportData.type}-${localDateString()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    });
}

/* Device Management: register a device */

/** Validates and submits the device registration form, displays the one-time device token, and warns before replacing a token still on screen. */
async function handleDeviceRegistration(event) {
    event.preventDefault();

    if (!dashboardReady) {
        deviceRegistrationMessage.textContent =
            'Your session is not ready. Please try again.';
        return;
    }

    // Protect a previously generated token from accidental replacement.
    if (!deviceTokenPanel.hidden) {
        const saved = window.confirm(
            'A previously generated device token is still displayed. ' +
            'Make sure you have saved it securely before registering another device. Continue?'
        );

        if (!saved) return;
    }

    registerDeviceButton.disabled = true;
    registerDeviceButton.textContent = 'Registering...';
    deviceRegistrationMessage.textContent = '';
    deviceTokenPanel.hidden = true;
    deviceTokenOutput.textContent = '';

    const payload = {
        deviceCode: deviceCodeInput.value.trim(),
        deviceType: deviceTypeInput.value,
        firmwareVersion: deviceFirmwareVersionInput.value.trim(),
        description: deviceDescriptionInput.value.trim()
    };

    if (devicePetSelect.value) {
        payload.petId = devicePetSelect.value;
    }

    try {
        const data = await apiRequest('/api/clinic/devices', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!data.deviceToken) {
            throw new Error(
                'The device was registered, but no token was returned. ' +
                'Refresh the device list and verify the registration.'
            );
        }

        deviceTokenOutput.textContent = data.deviceToken;
        deviceTokenPanel.hidden = false;

        deviceRegistrationMessage.textContent =
            'Device registered successfully. Save its token securely now.';

        deviceRegistrationForm.reset();
        populateDevicePetOptions();

        await loadDevices();

        deviceTokenPanel.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    } catch (error) {
        deviceRegistrationMessage.textContent =
            `Unable to register device: ${error.message}`;
    } finally {
        registerDeviceButton.disabled = false;
        registerDeviceButton.textContent = 'Register Device';
    }
}

/** Fetches feeding events (optionally filtered by status) and renders cards with schedule, portion, and timing details. */
async function loadFeedingEvents() {
    if (!dashboardReady || !feedingEventsHistory) return;

    const status = feedingStatusFilter
        ? feedingStatusFilter.value
        : '';

    const query = status
        ? `?status=${encodeURIComponent(status)}`
        : '';

    feedingEventsHistory.replaceChildren();
    feedingEventsHistory.setAttribute('aria-busy', 'true');

    addText(
        feedingEventsHistory,
        'p',
        'Loading feeding history...',
        'muted'
    );

    if (refreshFeedingEventsButton) {
        refreshFeedingEventsButton.disabled = true;
    }

    try {
        const data = await apiRequest(
            `/api/clinic/feeding-events${query}`
        );

        const events = Array.isArray(data.events)
            ? data.events
            : [];

        feedingEventsHistory.replaceChildren();

        if (events.length === 0) {
            const message = status
                ? 'No feeding events match this status filter.'
                : 'No feeding events have been recorded yet.';

            addText(feedingEventsHistory, 'p', message, 'muted');
            return;
        }

        addText(
            feedingEventsHistory,
            'p',
            `${events.length} feeding event(s) found.`,
            'muted'
        );

        const eventList = document.createElement('div');
        eventList.className = 'feeding-events-list';

        const dayNames = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];

        events.forEach((event) => {
            const card = document.createElement('article');
            card.className = 'feeding-card';

            const petName = event.pet?.name || 'Unknown pet';
            const petCode = event.pet?.petCode || 'No pet code';
            const deviceCode = event.feeder?.deviceCode || 'Unknown feeder';
            const eventStatus = event.status || 'Unknown';

            addText(
                card,
                'h3',
                `${petName} (${petCode})`
            );

            addText(
                card,
                'p',
                `Feeder: ${deviceCode}`,
                'muted'
            );

            addText(
                card,
                'p',
                `Status: ${eventStatus}`,
                `feeding-status ${eventStatus.toLowerCase()}`
            );

            const details = document.createElement('dl');
            details.className = 'feeding-event-details';

            /** Appends a labelled definition-list row (dt/dd) to a feeding-event details block. */
            function addDetail(label, value) {
                const item = document.createElement('div');
                item.className = 'feeding-event-detail';

                addText(item, 'dt', label);
                addText(item, 'dd', String(value));

                details.appendChild(item);
            }

            const schedule = event.schedule;
            const scheduleTime = schedule?.timeOfDay
                ? `${schedule.timeOfDay} (${schedule.timezone || 'timezone not specified'})`
                : 'No linked schedule';

            const scheduleDays = Array.isArray(schedule?.daysOfWeek)
                ? schedule.daysOfWeek
                    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
                    .map((day) => dayNames[day])
                    .join(', ')
                : '';

            addDetail('Event ID', event.eventId || 'Not provided');
            addDetail('Feeding source', event.source || 'Not provided');
            addDetail('Scheduled time', scheduleTime);

            if (scheduleDays) {
                addDetail('Scheduled days', scheduleDays);
            }

            addDetail(
                'Requested food',
                Number.isFinite(event.requestedGrams)
                    ? `${event.requestedGrams} g`
                    : 'Not provided'
            );

            addDetail(
                'Reported dispensed food',
                Number.isFinite(event.dispensedGrams)
                    ? `${event.dispensedGrams} g`
                    : 'Not reported'
            );

            addDetail('Started', formatDateTime(event.startedAt));
            addDetail('Completed', formatDateTime(event.completedAt));

            if (event.failureReason) {
                addDetail('Failure reason', event.failureReason);
            }

            details.setAttribute('aria-label', 'Feeding event details');
            card.appendChild(details);
            eventList.appendChild(card);
        });

        feedingEventsHistory.appendChild(eventList);
    } catch (error) {
        feedingEventsHistory.replaceChildren();

        addText(
            feedingEventsHistory,
            'p',
            error.message || 'Unable to load feeding history.',
            'error'
        );
    } finally {
        feedingEventsHistory.setAttribute('aria-busy', 'false');

        if (refreshFeedingEventsButton) {
            refreshFeedingEventsButton.disabled = false;
        }
    }
}

// Automatically start the camera when Scan Pet QR opens.
/** Resets the QR workspace and starts the camera, requesting permission and reporting decoder and permission errors. */
async function startQrScanner() {
    if (!qrCameraVideo || !qrScannerCanvas) return;
    if (qrCameraStream) return;

    qrScanBusy = false;
    currentQrPet = null;

    if (qrPetProfilePanel) {
        qrPetProfilePanel.hidden = true;
    }

    if (qrScanAnotherButton) {
        qrScanAnotherButton.hidden = true;
    }

    if (qrPetPhotoObjectUrl) {
        URL.revokeObjectURL(qrPetPhotoObjectUrl);
        qrPetPhotoObjectUrl = null;
    }

    if (qrPetPhoto) {
        qrPetPhoto.removeAttribute('src');
        qrPetPhoto.hidden = true;
    }

    if (qrScannerStatus) {
        showMessage(qrScannerStatus, 'Requesting camera access...');
    }

    try {
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error(
                'Camera access is unavailable. Open SmartVet through localhost or HTTPS.'
            );
        }

        if (typeof jsQR !== 'function') {
            throw new Error('The QR decoder failed to load. Refresh the page and try again.');
        }

        qrCameraStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: { ideal: 'environment' }
            }
        });

        qrCameraVideo.srcObject = qrCameraStream;
        await qrCameraVideo.play();

        if (qrScannerStatus) {
            showMessage(
                qrScannerStatus,
                'Camera active. Point it at an approved SmartVet pet QR code.'
            );
        }

        scanQrCameraFrame();
    } catch (error) {
        stopQrScanner();

        if (qrScannerStatus) {
            showMessage(
                qrScannerStatus,
                error.name === 'NotAllowedError'
                    ? 'Camera permission was denied. Allow camera access in your browser settings and try again.'
                    : error.message || 'Unable to start the camera.',
                'error'
            );
        }

        if (qrScanAnotherButton) {
            qrScanAnotherButton.hidden = false;
        }
    }
}

// Continuously decode frames from the camera.
/** Reads one camera frame, decodes it with jsQR, and either handles a detected code or schedules the next frame. */
function scanQrCameraFrame() {
    if (
        !qrCameraStream ||
        qrScanBusy ||
        !qrCameraVideo ||
        qrCameraVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
        if (qrCameraStream && !qrScanBusy) {
            qrAnimationFrameId = requestAnimationFrame(scanQrCameraFrame);
        }
        return;
    }

    const width = qrCameraVideo.videoWidth;
    const height = qrCameraVideo.videoHeight;

    if (!width || !height) {
        qrAnimationFrameId = requestAnimationFrame(scanQrCameraFrame);
        return;
    }

    const canvas = qrScannerCanvas;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = width;
    canvas.height = height;

    context.drawImage(qrCameraVideo, 0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height);

    const result = jsQR(
        imageData.data,
        imageData.width,
        imageData.height,
        { inversionAttempts: 'dontInvert' }
    );

    if (result?.data) {
        qrScanBusy = true;
        stopQrScanner();
        handleScannedPetQr(result.data);
        return;
    }

    qrAnimationFrameId = requestAnimationFrame(scanQrCameraFrame);
}

// Retrieve the pet only after the backend validates its QR identifier.
/** Validates the scanned identifier format, looks the pet up through the clinic API, and shows the result or an error. */
async function handleScannedPetQr(identifier) {
    if (!/^[a-fA-F0-9]{64}$/.test(identifier)) {
        if (qrScannerStatus) {
            showMessage(
                qrScannerStatus,
                'This is not a valid SmartVet pet QR code.',
                'error'
            );
        }

        if (qrScanAnotherButton) {
            qrScanAnotherButton.hidden = false;
        }

        return;
    }

    if (qrScannerStatus) {
        showMessage(qrScannerStatus, 'QR code recognized. Looking up the pet...');
    }

    try {
        const data = await apiRequest(
            `/api/clinic/pets/qr/${encodeURIComponent(identifier)}`
        );

        if (!data.success || !data.pet) {
            throw new Error('No approved pet was found for this QR code.');
        }

        currentQrPet = data.pet;
        displayScannedPet(data.pet);

        if (qrScannerStatus) {
            showMessage(
                qrScannerStatus,
                `Pet identified successfully: ${data.pet.name}`
            );
        }

        if (qrScanAnotherButton) {
            qrScanAnotherButton.hidden = false;
        }
    } catch (error) {
        if (qrScannerStatus) {
            showMessage(
                qrScannerStatus,
                error.message || 'Unable to retrieve the pet record.',
                'error'
            );
        }

        if (qrScanAnotherButton) {
            qrScanAnotherButton.hidden = false;
        }
    } finally {
        qrScanBusy = false;
    }
}

// Display the pet details returned by the authenticated clinic API.
/** Fills the QR pet profile panel with the pet's details and status styling, and loads its photo when available. */
function displayScannedPet(pet) {
    if (!qrPetProfilePanel) return;

    qrPetName.textContent = pet.name || 'Unnamed pet';
    qrPetCode.textContent = `Official Pet ID: ${pet.petCode || 'Unavailable'}`;
    qrPetSpecies.textContent = pet.species || 'Not specified';
    qrPetBreed.textContent = pet.breed || 'Not specified';
    qrPetSex.textContent = pet.sex || 'Unknown';
    qrPetColor.textContent = pet.color || 'Not specified';
    qrPetOwnerName.textContent = pet.owner?.fullName || 'Owner unavailable';

    qrPetDateOfBirth.textContent = pet.dateOfBirth
        ? new Date(pet.dateOfBirth).toLocaleDateString()
        : 'Not provided';

    qrPetStatusBadge.textContent = pet.registrationStatus || 'Unknown';
    
    // Apply green success color if approved
    if ((pet.registrationStatus || '').toLowerCase() === 'approved') {
        qrPetStatusBadge.classList.add('is-verified');
    } else {
        qrPetStatusBadge.classList.remove('is-verified');
    }
    qrPetProfilePanel.hidden = false;

    if (pet.id && pet.photoEndpoint) {
        loadScannedPetPhoto(pet.id);
    } else {
        qrPetPhoto.removeAttribute('src');
        qrPetPhoto.hidden = true;
    }
}

// Display the personal information of a pet's owner in the shared dialog.
/**
 * Fills the owner-details dialog from a pet record's `owner` object (including
 * the profile photo) and opens it. Defaults to the scanned QR pet, and is also
 * called with a pending-registration card's pet.
 */
function openQrOwnerDetails(pet = currentQrPet) {
    if (!pet || !pet.owner || !qrOwnerDetailsDialog) {
        return;
    }

    const owner = pet.owner;

    if (!owner) {
        if (qrScannerStatus) {
            showMessage(qrScannerStatus, 'Owner information is unavailable for this pet.', 'error');
        }
        return;
    }

    // 1. Populate the text
/** Sets an element's text to a value or "Not provided", ignoring missing elements. */
    const setDetail = (element, value) => {
        if (element) {
            element.textContent = value || 'Not provided';
        }
    };

    if (qrOwnerName) {
        qrOwnerName.textContent = owner.fullName || 'Name unavailable';
    }

    setDetail(qrOwnerEmail, owner.email);
    setDetail(qrOwnerPhone, owner.phone);
    setDetail(qrOwnerDateOfBirth, owner.dateOfBirth);
    setDetail(qrOwnerGender, owner.gender);
    setDetail(qrOwnerCivilStatus, owner.civilStatus);
    setDetail(qrOwnerNationality, owner.nationality);
    setDetail(qrOwnerGovId, owner.govId);
    setDetail(qrOwnerOccupation, owner.occupation);
    setDetail(qrOwnerAddress, owner.address);
    setDetail(qrOwnerPermanentAddress, owner.permanentAddress);

    // 2. Handle the profile photo
    if (owner.hasProfilePhoto && owner.photoEndpoint) {
        loadScannedOwnerPhoto(owner.photoEndpoint);
    } else {
        if (qrOwnerPhoto) {
            qrOwnerPhoto.removeAttribute('src');
            qrOwnerPhoto.hidden = true;
        }
        if (qrOwnerPhotoPlaceholder) {
            qrOwnerPhotoPlaceholder.hidden = false;
        }
    }

    if (!qrOwnerDetailsDialog.open) {
        qrOwnerDetailsDialog.showModal();
    }
}

// NEW FUNCTION: Load the scanned owner's photo from the clinic endpoint
/** Fetches the owner's photo with the session token and shows it, falling back to the placeholder on failure. */
async function loadScannedOwnerPhoto(photoEndpoint) {
    try {
        const response = await fetch(photoEndpoint, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                Accept: 'image/jpeg, image/png, image/webp'
            },
            cache: 'no-store'
        });

        if (!response.ok) throw new Error('Photo unavailable');

        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        if (qrOwnerPhoto) {
            qrOwnerPhoto.src = imageUrl;
            qrOwnerPhoto.hidden = false;
        }
        if (qrOwnerPhotoPlaceholder) {
            qrOwnerPhotoPlaceholder.hidden = true;
        }
    } catch {
        if (qrOwnerPhoto) {
            qrOwnerPhoto.hidden = true;
        }
        if (qrOwnerPhotoPlaceholder) {
            qrOwnerPhotoPlaceholder.hidden = false;
        }
    }
}

// Open the vaccination form for the pet identified by QR.
if (qrAddVaccinationButton) {
    qrAddVaccinationButton.addEventListener('click', () => {
        if (!currentQrPet || !currentQrPet.id) {
            showMessage(
                qrScannerStatus,
                'Scan an approved pet before recording a vaccination.',
                'error'
            );
            return;
        }

        if (qrVaccinationPetName) {
            qrVaccinationPetName.textContent =
                `Selected pet: ${currentQrPet.name || 'Unnamed pet'} (${currentQrPet.petCode || 'No Pet ID'})`;
        }

        if (qrVaccinationForm) {
            qrVaccinationForm.reset();
        }

        if (qrVaccinationMessage) {
            showMessage(qrVaccinationMessage, '');
        }

        const today = localDateString();
        const administeredInput = document.getElementById('qrAdministeredDate');
        const dueDateInput = document.getElementById('qrNextDueDate');

        if (administeredInput) {
            administeredInput.max = today;
        }

        if (dueDateInput) {
            dueDateInput.min = '';
        }

        if (
            qrVaccinationRecordDialog &&
            !qrVaccinationRecordDialog.open
        ) {
            qrVaccinationRecordDialog.showModal();
        }
    });
}


// Save vaccination records for the pet identified by QR.
if (qrVaccinationForm) {
    qrVaccinationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!currentQrPet || !currentQrPet.id) {
            showMessage(
                qrVaccinationMessage,
                'Please scan an approved pet first.',
                'error'
            );
            return;
        }

        const vaccineName =
            document.getElementById('qrVaccineName').value.trim();

        const administeredDate =
            document.getElementById('qrAdministeredDate').value;

        const nextDueDate =
            document.getElementById('qrNextDueDate').value;

        const today = localDateString();

        if (!vaccineName || !administeredDate) {
            showMessage(
                qrVaccinationMessage,
                'Vaccine name and administration date are required.',
                'error'
            );
            return;
        }

        if (administeredDate > today) {
            showMessage(
                qrVaccinationMessage,
                'Administration date cannot be in the future.',
                'error'
            );
            return;
        }

        if (nextDueDate && nextDueDate < administeredDate) {
            showMessage(
                qrVaccinationMessage,
                'Next due date cannot be earlier than the administration date.',
                'error'
            );
            return;
        }

        const payload = {
            vaccineName,
            administeredDate,
            batchNumber:
                document.getElementById('qrBatchNumber').value.trim(),
            manufacturer:
                document.getElementById('qrManufacturer').value.trim(),
            dosage:
                document.getElementById('qrDosage').value.trim(),
            notes:
                document.getElementById('qrVaccinationNotes').value.trim()
        };

        if (nextDueDate) {
            payload.nextDueDate = nextDueDate;
        }

        qrSaveVaccinationButton.disabled = true;
        qrSaveVaccinationButton.textContent = 'Saving...';

        try {
            const data = await apiRequest(
                `/api/clinic/pets/${encodeURIComponent(currentQrPet.id)}/vaccinations`,
                {
                    method: 'POST',
                    body: JSON.stringify(payload)
                }
            );

            showMessage(
                qrVaccinationMessage,
                data.message || 'Vaccination record saved successfully.',
                'success'
            );

            qrVaccinationForm.reset();

            const administeredInput =
                document.getElementById('qrAdministeredDate');

            if (administeredInput) {
                administeredInput.max = localDateString();
            }
        } catch (error) {
            showMessage(
                qrVaccinationMessage,
                error.message || 'Unable to save the vaccination record.',
                'error'
            );
        } finally {
            qrSaveVaccinationButton.disabled = false;
            qrSaveVaccinationButton.textContent = 'Save Vaccination';
        }
    });
}

// Load vaccination history for the currently scanned pet.
/** Fetches and renders vaccination history cards for the currently scanned pet. */
async function loadQrVaccinationHistory() {
    if (!currentQrPet || !currentQrPet.id || !qrVaccinationHistoryList) {
        return;
    }

    qrHistoryPetName.textContent =
        `Selected pet: ${currentQrPet.name || 'Unnamed pet'} (${currentQrPet.petCode || 'No Pet ID'})`;

    qrVaccinationHistoryList.setAttribute('aria-busy', 'true');
    qrVaccinationHistoryList.replaceChildren();

    const loadingMessage = document.createElement('p');
    loadingMessage.className = 'muted';
    loadingMessage.textContent = 'Loading vaccination history...';
    qrVaccinationHistoryList.appendChild(loadingMessage);

    try {
        const data = await apiRequest(
            `/api/clinic/pets/${encodeURIComponent(currentQrPet.id)}/vaccinations`
        );

        const records = Array.isArray(data.vaccinations)
            ? data.vaccinations
            : [];

        qrVaccinationHistoryList.replaceChildren();

        if (records.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty';
            emptyMessage.textContent =
                'No vaccination records have been entered for this pet yet.';
            qrVaccinationHistoryList.appendChild(emptyMessage);
            return;
        }

        records.forEach((record) => {
            const card = document.createElement('article');
            card.className = 'qr-vaccination-history-card';

            const heading = document.createElement('h3');
            heading.textContent = record.vaccineName || 'Unnamed vaccine';
            card.appendChild(heading);

            const rows = [
                [
                    'Administration date',
                    record.administeredDate
                        ? String(record.administeredDate).slice(0, 10)
                        : 'Not recorded'
                ],
                [
                    'Next due date',
                    record.nextDueDate
                        ? String(record.nextDueDate).slice(0, 10)
                        : 'Not specified'
                ]
            ];

            if (record.batchNumber) rows.push(['Batch number', record.batchNumber]);
            if (record.manufacturer) rows.push(['Manufacturer', record.manufacturer]);
            if (record.dosage) rows.push(['Dosage', record.dosage]);

            if (record.administeredBy?.fullName) {
                rows.push(['Recorded by', record.administeredBy.fullName]);
            }

            if (record.notes) rows.push(['Notes', record.notes]);

            rows.forEach(([label, value]) => {
                const row = document.createElement('div');
                row.className = 'qr-vaccination-history-row';

                const labelSpan = document.createElement('span');
                labelSpan.className = 'qr-vaccination-history-label';
                labelSpan.textContent = label;

                const valueSpan = document.createElement('span');
                valueSpan.className = 'qr-vaccination-history-value';
                valueSpan.textContent = value;

                row.append(labelSpan, valueSpan);
                card.appendChild(row);
            });

            qrVaccinationHistoryList.appendChild(card);
        });
    } catch (error) {
        qrVaccinationHistoryList.replaceChildren();

        const errorMessage = document.createElement('p');
        errorMessage.className = 'message error';
        errorMessage.textContent =
            error.message || 'Unable to load vaccination history.';

        qrVaccinationHistoryList.appendChild(errorMessage);
    } finally {
        qrVaccinationHistoryList.setAttribute('aria-busy', 'false');
    }
}

// Open the vaccination history modal for the scanned pet.
if (qrVaccinationHistoryButton) {
    qrVaccinationHistoryButton.addEventListener('click', async () => {
        if (!currentQrPet || !currentQrPet.id) {
            showMessage(
                qrScannerStatus,
                'Scan an approved pet before viewing vaccination history.',
                'error'
            );
            return;
        }

        if (qrVaccinationHistoryDialog && !qrVaccinationHistoryDialog.open) {
            qrVaccinationHistoryDialog.showModal();
        }

        await loadQrVaccinationHistory();
    });
}

if (qrOwnerDetailsButton) {
    qrOwnerDetailsButton.addEventListener(
        'click',
        openQrOwnerDetails
    );
}

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => {
        const dialogId = button.dataset.closeDialog;
        const dialog = document.getElementById(dialogId);

        if (dialog && dialog.open) {
            dialog.close();
        }
    });
});


// Load the pet photograph through the protected clinic photo endpoint.
// Load the pet photograph through the protected clinic photo endpoint.
/** Fetches the scanned pet's photo with the session token, revoking any previous object URL before showing the new one. */
async function loadScannedPetPhoto(petId) {
    try {
        const response = await fetch(
            `/api/clinic/pets/${encodeURIComponent(petId)}/photo`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    Accept: 'image/jpeg, image/png, image/webp'
                },
                cache: 'no-store'
            }
        );

        if (!response.ok) {
            throw new Error('Pet photo unavailable.');
        }

        const imageBlob = await response.blob();

        if (qrPetPhotoObjectUrl) {
            URL.revokeObjectURL(qrPetPhotoObjectUrl);
        }

        qrPetPhotoObjectUrl = URL.createObjectURL(imageBlob);
        qrPetPhoto.src = qrPetPhotoObjectUrl;
        qrPetPhoto.hidden = false;
    } catch {
        qrPetPhoto.removeAttribute('src');
        qrPetPhoto.hidden = true;
    }
}

// Stop the camera and release its hardware tracks.
/** Cancels the decode loop, stops all camera tracks, and clears the video stream. */
function stopQrScanner() {
    if (qrAnimationFrameId !== null) {
        cancelAnimationFrame(qrAnimationFrameId);
        qrAnimationFrameId = null;
    }

    if (qrCameraStream) {
        qrCameraStream.getTracks().forEach((track) => track.stop());
        qrCameraStream = null;
    }

    if (qrCameraVideo) {
        qrCameraVideo.pause();
        qrCameraVideo.srcObject = null;
    }
}

// Allow the user to scan another pet without a Start button.
if (qrScanAnotherButton) {
    qrScanAnotherButton.addEventListener('click', () => {
        startQrScanner();
    });
}


/** Verifies the signed-in account via /api/auth/me, gates administrator-only UI, and kicks off the initial dashboard loads. */
async function verifyVeterinarySession() {
    if (!getToken()) {
        logout();
        return;
    }

    try {
        const data = await apiRequest('/api/auth/me');
        const user = data.user || data;

        const administratorRoles = ['veterinarian', 'veterinary_staff'];

        if (!administratorRoles.includes(user.role)) {
            logout();
            return;
        }

        const isAdministrator = user.role === 'veterinarian';

        // Administrator-only navigation stays hidden for veterinary staff, and
        // so do the sections behind it, so no stale panel can be revealed.
        document.querySelectorAll('[data-administrator-only]').forEach((node) => {
            node.hidden = !isAdministrator;
        });

        welcomeHeading.textContent =
            `Welcome, ${user.fullName || 'Veterinary Staff'}`;

        showMessage(
            sessionMessage,
            isAdministrator
                ? 'Signed in as the veterinary administrator.'
                : 'Signed in as veterinary staff.',
            'success'
        );

        sessionBadge.textContent = isAdministrator
            ? 'Administrator session'
            : 'Session verified';
        sessionBadge.classList.add('is-verified');

        dashboardReady = true;

        await Promise.all([
            loadPendingPets(),
            loadApprovedPets(),
            loadDashboardOverview()
        ]);
    } catch (error) {
        showMessage(
            sessionMessage,
            error.message || 'Unable to verify your session.',
            'error'
        );

        sessionBadge.textContent = 'Session unavailable';
    }
}

refreshButton.addEventListener('click', loadPendingPets);
logoutButton.addEventListener('click', logout);


if (feedingStatusFilter) {
    feedingStatusFilter.addEventListener('change', loadFeedingEvents);
}

if (refreshFeedingEventsButton) {
    refreshFeedingEventsButton.addEventListener('click', loadFeedingEvents);
}


if (refreshDevicesButton) {
    refreshDevicesButton.addEventListener('click', loadDevices);
}

// Device registration form
if (deviceRegistrationForm) {
    deviceRegistrationForm.addEventListener(
        'submit',
        handleDeviceRegistration
    );
}

// Copy the generated device token securely
if (copyDeviceTokenButton) {
    copyDeviceTokenButton.addEventListener('click', async () => {
        const token = deviceTokenOutput.textContent.trim();

        if (!token) {
            deviceManagementMessage.textContent =
                'No device token is available to copy.';
            return;
        }

        try {
            await navigator.clipboard.writeText(token);
            deviceManagementMessage.textContent =
                'Device token copied. Store it securely.';
        } catch (error) {
            deviceManagementMessage.textContent =
                'Automatic copying failed. Select and copy the displayed token manually.';
        }
    });
}


/* Sidebar collapse/expand */
/** Restores the persisted sidebar collapsed state and wires the toggle to update it. */
(function initializeClinicSidebarToggle() {
    const shell = document.querySelector('.clinic-shell');
    const toggle = document.getElementById('clinicSidebarToggle');

    if (!shell || !toggle) return;

    const storageKey = 'smartvetClinicSidebarCollapsed';

/** Applies the collapsed class and updates the toggle's expanded state, label, and title. */
    function applyCollapsedState(collapsed) {
        shell.classList.toggle('sidebar-collapsed', collapsed);

        const action = collapsed ? 'Expand' : 'Collapse';
        toggle.setAttribute('aria-expanded', String(!collapsed));
        toggle.setAttribute('aria-label', `${action} sidebar`);
        toggle.title = `${action} sidebar`;
    }

    applyCollapsedState(
        localStorage.getItem(storageKey) === 'true'
    );

    toggle.addEventListener('click', () => {
        const collapsed = !shell.classList.contains('sidebar-collapsed');

        applyCollapsedState(collapsed);
        localStorage.setItem(storageKey, String(collapsed));
    });
})();


/* SmartVet shared light/dark theme (System Settings > Appearance) */
/** Restores the persisted light/dark theme and wires the theme option buttons. */
(function initializeClinicTheme() {
    const storageKey = 'smartvetTheme';
    const optionButtons = Array.from(
        document.querySelectorAll('[data-theme-option]')
    );

/** Returns the active theme ("dark" or "light") from the body's data attribute. */
    function currentTheme() {
        return document.body.dataset.theme === 'dark' ? 'dark' : 'light';
    }

    /** Sets the body theme attribute and marks the matching option button as selected. */
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

            window.setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 400);
        });
    });
})();


/* ===========================================================================
   VETERINARY ADMINISTRATION
   User management, system settings, the global IoT device registry, and the
   system audit trail. Every area here is gated twice: the sidebar items and
   sections stay hidden for veterinary_staff, and every endpoint additionally
   requires the veterinarian role.
   =========================================================================== */

const ADMINISTRATOR_ONLY_ROLES = ['veterinarian'];

// --- User management elements -------------------------------------------
const vetUsersTableBody = document.getElementById('vetUsersTableBody');
const vetUsersMessage = document.getElementById('vetUsersMessage');
const refreshVetUsersButton = document.getElementById('refreshVetUsersButton');
const addVetUserButton = document.getElementById('addVetUserButton');

const vetUserDialog = document.getElementById('vetUserDialog');
const vetUserForm = document.getElementById('vetUserForm');
const vetUserDialogTitle = document.getElementById('vetUserDialogTitle');
const vetUserDialogSubtitle = document.getElementById('vetUserDialogSubtitle');
const vetUserFormMessage = document.getElementById('vetUserFormMessage');
const saveVetUserButton = document.getElementById('saveVetUserButton');
const vetUserPasswordHint = document.getElementById('vetUserPasswordHint');

const vetPasswordDialog = document.getElementById('vetPasswordDialog');
const vetPasswordForm = document.getElementById('vetPasswordForm');
const vetPasswordDialogSubtitle = document.getElementById('vetPasswordDialogSubtitle');
const vetPasswordMessage = document.getElementById('vetPasswordMessage');
const saveVetPasswordButton = document.getElementById('saveVetPasswordButton');

// --- System settings elements -------------------------------------------
const clinicSettingsForm = document.getElementById('clinicSettingsForm');
const systemSettingsMessage = document.getElementById('systemSettingsMessage');
const saveSystemSettingsButton = document.getElementById('saveSystemSettingsButton');

const systemSettingFields = [
    'clinicName', 'clinicEmail', 'clinicPhone', 'clinicAddress',
    'requirePetVerification', 'allowOwnerRegistration', 'allowOwnerPinUnlock',
    'reminderEnabled', 'reminderDaysBefore', 'deviceTelemetryEnabled',
    'maxLoginAttempts', 'sessionTimeoutMinutes'
];

// --- Device registry elements -------------------------------------------
const deviceRegistryTableBody = document.getElementById('deviceRegistryTableBody');
const deviceRegistryMessage = document.getElementById('deviceRegistryMessage');
const deviceRegistryStats = document.getElementById('deviceRegistryStats');
const refreshDeviceRegistryButton = document.getElementById('refreshDeviceRegistryButton');
const deviceRegistryStatusFilter = document.getElementById('deviceRegistryStatusFilter');
const deviceRegistryTypeFilter = document.getElementById('deviceRegistryTypeFilter');

// --- Audit log elements --------------------------------------------------
const auditLogsTableBody = document.getElementById('auditLogsTableBody');
const auditLogsMessage = document.getElementById('auditLogsMessage');
const auditOverviewStats = document.getElementById('auditOverviewStats');
const refreshAuditLogsButton = document.getElementById('refreshAuditLogsButton');
const auditActionFilter = document.getElementById('auditActionFilter');
const auditEntityTypeFilter = document.getElementById('auditEntityTypeFilter');
const auditSourceFilter = document.getElementById('auditSourceFilter');
const applyAuditFiltersButton = document.getElementById('applyAuditFiltersButton');

// The user id embedded in the signed-in administrator's token.
const currentAdministratorId = SmartVetSession.getUser()?.id || '';

const ADMIN_ROLE_LABELS = {
    veterinarian: 'Administrator',
    veterinary_staff: 'Veterinary Staff'
};

let veterinaryUsers = [];

/** Maps a role key to its display label, falling back to the raw role or "Unknown". */
function adminRoleLabel(role) {
    return ADMIN_ROLE_LABELS[role] || role || 'Unknown';
}

// True when the signed-in account may use the administration areas.
/** Returns true when the stored session user has an administrator-only role. */
function isAdministratorSession() {
    const user = SmartVetSession.getUser();
    return Boolean(user && ADMINISTRATOR_ONLY_ROLES.includes(user.role));
}

/** Opens a dialog with showModal() when supported, otherwise falls back to the open attribute. */
function openAdminDialog(dialog) {
    if (!dialog) return;

    if (typeof dialog.showModal === 'function') {
        dialog.showModal();
    } else {
        dialog.setAttribute('open', '');
    }
}

/** Closes a dialog with close() when supported, otherwise removes the open attribute. */
function closeAdminDialog(dialog) {
    if (!dialog) return;

    if (typeof dialog.close === 'function') {
        dialog.close();
    } else {
        dialog.removeAttribute('open');
    }
}

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => {
        closeAdminDialog(document.getElementById(button.dataset.closeDialog));
    });
});

/** Sets a select's value, falling back to the first option when the value is not offered. */
function setAdminSelectValue(select, value) {
    if (!select) return;

    const stringValue = value === null || value === undefined ? '' : String(value);

    select.value = stringValue;

    // Fall back to the first option when the stored value is not offered.
    if (select.value !== stringValue) {
        select.selectedIndex = 0;
    }
}

/** Appends a table cell with optional class and data-label, rendering empty values as "Not provided". */
function textCell(tableRow, value, className = '', label = '') {
    const cell = document.createElement('td');

    if (className) {
        cell.className = className;
    }

    if (label) {
        cell.dataset.label = label;
    }

    cell.textContent = value || 'Not provided';
    tableRow.appendChild(cell);

    return cell;
}

/* --- User management ----------------------------------------------------- */

/** Renders the veterinary staff table from the cached users array, including edit, password-reset, and delete actions. */
function renderVeterinaryUsers() {
    if (!vetUsersTableBody) return;

    vetUsersTableBody.replaceChildren();

    if (veterinaryUsers.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = 6;
        cell.className = 'muted';
        cell.textContent = 'No veterinary staff accounts have been created yet.';

        row.appendChild(cell);
        vetUsersTableBody.appendChild(row);
        return;
    }

    veterinaryUsers.forEach((user) => {
        const row = document.createElement('tr');

        textCell(row, user.fullName, '', 'Name');
        textCell(row, user.email, '', 'Email');
        textCell(row, adminRoleLabel(user.role), 'admin-table-nowrap', 'Role');

        const statusCell = document.createElement('td');
        const status = document.createElement('span');

        status.className = `device-status device-status-${user.status === 'active' ? 'active' : 'revoked'}`;
        status.textContent = user.status === 'active' ? 'Active' : 'Disabled';
        statusCell.dataset.label = 'Status';
        statusCell.appendChild(status);
        row.appendChild(statusCell);

        textCell(
            row,
            user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Never signed in',
            'admin-table-nowrap',
            'Last Sign-in'
        );

        const actionsCell = document.createElement('td');
        actionsCell.className = 'admin-table-actions admin-table-nowrap';
        actionsCell.dataset.label = 'Actions';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'secondary';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => openVetUserDialog(user));
        actionsCell.appendChild(editButton);

        const passwordButton = document.createElement('button');
        passwordButton.type = 'button';
        passwordButton.className = 'secondary';
        passwordButton.textContent = 'Reset Password';
        passwordButton.addEventListener('click', () => openVetPasswordDialog(user));
        actionsCell.appendChild(passwordButton);

        if (user.id !== currentAdministratorId) {
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'secondary';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteVeterinaryUser(user));
            actionsCell.appendChild(deleteButton);
        }

        row.appendChild(actionsCell);
        vetUsersTableBody.appendChild(row);
    });
}

/** Fetches the staff account list, caches it, and re-renders the table with loading and error states. */
async function loadVeterinaryUsers() {
    if (!dashboardReady || !vetUsersTableBody) return;

    vetUsersTableBody.replaceChildren();

    const loadingRow = document.createElement('tr');
    const loadingCell = document.createElement('td');

    loadingCell.colSpan = 6;
    loadingCell.className = 'muted';
    loadingCell.textContent = 'Loading staff accounts...';

    loadingRow.appendChild(loadingCell);
    vetUsersTableBody.appendChild(loadingRow);

    if (refreshVetUsersButton) refreshVetUsersButton.disabled = true;

    try {
        const data = await apiRequest('/api/clinic/admin/users');

        veterinaryUsers = Array.isArray(data.users) ? data.users : [];
        renderVeterinaryUsers();

        if (vetUsersMessage) {
            showMessage(vetUsersMessage, '', '');
        }
    } catch (error) {
        veterinaryUsers = [];
        renderVeterinaryUsers();

        if (vetUsersMessage) {
            showMessage(vetUsersMessage, error.message, 'error');
        }
    } finally {
        if (refreshVetUsersButton) refreshVetUsersButton.disabled = false;
    }
}

/** Prepares the add/edit staff dialog for a user (or a blank form) and opens it. */
function openVetUserDialog(user = null) {
    if (!vetUserForm) return;

    vetUserForm.reset();
    vetUserFormMessage.textContent = '';
    vetUserFormMessage.className = 'message';

    const isEdit = Boolean(user);

    vetUserDialogTitle.textContent = isEdit ? 'Edit User' : 'Add User';
    vetUserDialogSubtitle.textContent = isEdit
        ? user.email
        : 'The account signs in at the veterinary portal.';

    // A password is only required when the account is first created.
    const passwordInput = document.getElementById('vetUserPassword');

    passwordInput.required = !isEdit;
    vetUserPasswordHint.textContent = isEdit
        ? 'Leave blank to keep the current password.'
        : 'Minimum 8 characters.';

    document.getElementById('vetUserFullName').value = user?.fullName || '';
    document.getElementById('vetUserEmail').value = user?.email || '';
    setAdminSelectValue(document.getElementById('vetUserRole'), user?.role || 'veterinary_staff');
    setAdminSelectValue(document.getElementById('vetUserStatus'), user?.status || 'active');
    setAdminSelectValue(
        document.getElementById('vetUserMustChangePassword'),
        user ? String(Boolean(user.mustChangePassword)) : 'false'
    );

    vetUserForm.dataset.userId = isEdit ? user.id : '';

    openAdminDialog(vetUserDialog);
}

/** Validates the staff form and creates or updates the account, then closes the dialog and reloads the list. */
async function submitVeterinaryUser(event) {
    event.preventDefault();

    const userId = vetUserForm.dataset.userId || '';
    const password = document.getElementById('vetUserPassword').value;

    if (!userId && password.length < 8) {
        vetUserFormMessage.textContent = 'Password must be at least 8 characters.';
        vetUserFormMessage.className = 'message error';
        return;
    }

    const payload = {
        fullName: document.getElementById('vetUserFullName').value.trim(),
        email: document.getElementById('vetUserEmail').value.trim(),
        role: document.getElementById('vetUserRole').value,
        status: document.getElementById('vetUserStatus').value,
        mustChangePassword: document.getElementById('vetUserMustChangePassword').value === 'true'
    };

    if (password) {
        payload.password = password;
    }

    saveVetUserButton.disabled = true;

    try {
        if (userId) {
            await apiRequest(`/api/clinic/admin/users/${encodeURIComponent(userId)}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
        } else {
            await apiRequest('/api/clinic/admin/users', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }

        closeAdminDialog(vetUserDialog);
        await loadVeterinaryUsers();

        if (vetUsersMessage) {
            showMessage(
                vetUsersMessage,
                userId ? 'User account updated.' : 'User account created.',
                'success'
            );
        }
    } catch (error) {
        vetUserFormMessage.textContent = error.message;
        vetUserFormMessage.className = 'message error';
    } finally {
        saveVetUserButton.disabled = false;
    }
}

/** Prepares the reset-password dialog for a user and opens it. */
function openVetPasswordDialog(user) {
    if (!vetPasswordForm || !user) return;

    vetPasswordForm.reset();
    vetPasswordMessage.textContent = '';
    vetPasswordMessage.className = 'message';
    vetPasswordDialogSubtitle.textContent = `${user.fullName} (${user.email})`;
    setAdminSelectValue(document.getElementById('vetPasswordMustChange'), 'true');
    vetPasswordForm.dataset.userId = user.id;

    openAdminDialog(vetPasswordDialog);
}

/** Validates and submits a new password for a staff account, then closes the dialog. */
async function submitVeterinaryPassword(event) {
    event.preventDefault();

    const password = document.getElementById('vetNewPassword').value;

    if (password.length < 8) {
        vetPasswordMessage.textContent = 'Password must be at least 8 characters.';
        vetPasswordMessage.className = 'message error';
        return;
    }

    saveVetPasswordButton.disabled = true;

    try {
        await apiRequest(
            `/api/clinic/admin/users/${encodeURIComponent(vetPasswordForm.dataset.userId)}/password`,
            {
                method: 'POST',
                body: JSON.stringify({
                    password,
                    mustChangePassword: document.getElementById('vetPasswordMustChange').value === 'true'
                })
            }
        );

        closeAdminDialog(vetPasswordDialog);

        if (vetUsersMessage) {
            showMessage(vetUsersMessage, 'Password updated.', 'success');
        }
    } catch (error) {
        vetPasswordMessage.textContent = error.message;
        vetPasswordMessage.className = 'message error';
    } finally {
        saveVetPasswordButton.disabled = false;
    }
}

/** Confirms and deletes a staff account (never the signed-in administrator), then reloads the list. */
async function deleteVeterinaryUser(user) {
    if (!user || user.id === currentAdministratorId) return;

    const confirmed = window.confirm(
        `Delete the unused account for ${user.fullName} (${user.email})?`
    );

    if (!confirmed) return;

    try {
        await apiRequest(`/api/clinic/admin/users/${encodeURIComponent(user.id)}`, {
            method: 'DELETE'
        });

        await loadVeterinaryUsers();

        if (vetUsersMessage) {
            showMessage(vetUsersMessage, 'User account deleted.', 'success');
        }
    } catch (error) {
        if (vetUsersMessage) {
            showMessage(vetUsersMessage, error.message, 'error');
        }
    }
}

/* --- System settings ----------------------------------------------------- */

/** Loads administrator settings into the form; non-administrators get an empty form and never call the admin endpoint. */
async function loadSystemSettings() {
    if (!dashboardReady || !clinicSettingsForm) return;

    // Appearance is open to every staff account; the clinic configuration
    // below it is administrator-only, so staff never call the admin endpoint.
    if (!isAdministratorSession()) {
        if (systemSettingsMessage) showMessage(systemSettingsMessage, '', '');
        return;
    }

    systemSettingFields.forEach((field) => {
        const element = document.getElementById(field);
        if (element) element.value = '';
    });

    try {
        const data = await apiRequest('/api/clinic/admin/settings');
        const settings = data.settings || {};

        document.getElementById('clinicName').value = settings.clinicName || '';
        document.getElementById('clinicEmail').value = settings.clinicEmail || '';
        document.getElementById('clinicPhone').value = settings.clinicPhone || '';
        document.getElementById('clinicAddress').value = settings.clinicAddress || '';

        setAdminSelectValue(
            document.getElementById('requirePetVerification'),
            String(settings.requirePetVerification ?? true)
        );
        setAdminSelectValue(
            document.getElementById('allowOwnerRegistration'),
            String(settings.allowOwnerRegistration ?? true)
        );
        setAdminSelectValue(
            document.getElementById('allowOwnerPinUnlock'),
            String(settings.allowOwnerPinUnlock ?? true)
        );
        setAdminSelectValue(
            document.getElementById('reminderEnabled'),
            String(settings.reminderEnabled ?? true)
        );
        setAdminSelectValue(
            document.getElementById('deviceTelemetryEnabled'),
            String(settings.deviceTelemetryEnabled ?? true)
        );

        document.getElementById('reminderDaysBefore').value =
            settings.reminderDaysBefore ?? 7;
        document.getElementById('maxLoginAttempts').value =
            settings.maxLoginAttempts ?? 10;
        document.getElementById('sessionTimeoutMinutes').value =
            settings.sessionTimeoutMinutes ?? 60;

        if (systemSettingsMessage) {
            showMessage(systemSettingsMessage, '', '');
        }
    } catch (error) {
        if (systemSettingsMessage) {
            showMessage(systemSettingsMessage, error.message, 'error');
        }
    }
}

/** Collects the settings form values and PUTs them to the admin settings endpoint. */
async function saveSystemSettings() {
    const payload = {
        clinicName: document.getElementById('clinicName').value.trim(),
        clinicEmail: document.getElementById('clinicEmail').value.trim(),
        clinicPhone: document.getElementById('clinicPhone').value.trim(),
        clinicAddress: document.getElementById('clinicAddress').value.trim(),
        requirePetVerification: document.getElementById('requirePetVerification').value === 'true',
        allowOwnerRegistration: document.getElementById('allowOwnerRegistration').value === 'true',
        allowOwnerPinUnlock: document.getElementById('allowOwnerPinUnlock').value === 'true',
        reminderEnabled: document.getElementById('reminderEnabled').value === 'true',
        reminderDaysBefore: Number(document.getElementById('reminderDaysBefore').value),
        deviceTelemetryEnabled: document.getElementById('deviceTelemetryEnabled').value === 'true',
        maxLoginAttempts: Number(document.getElementById('maxLoginAttempts').value),
        sessionTimeoutMinutes: Number(document.getElementById('sessionTimeoutMinutes').value)
    };

    saveSystemSettingsButton.disabled = true;

    try {
        await apiRequest('/api/clinic/admin/settings', {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        if (systemSettingsMessage) {
            showMessage(systemSettingsMessage, 'System settings saved.', 'success');
        }
    } catch (error) {
        if (systemSettingsMessage) {
            showMessage(systemSettingsMessage, error.message, 'error');
        }
    } finally {
        saveSystemSettingsButton.disabled = false;
    }
}

/* --- Global IoT device registry ----------------------------------------- */

/** Renders the active, disabled, and revoked device counts as stat cards. */
function renderDeviceRegistryStats(summary) {
    if (!deviceRegistryStats) return;

    deviceRegistryStats.replaceChildren();

    const entries = [
        ['Active', summary?.active],
        ['Disabled', summary?.disabled],
        ['Revoked', summary?.revoked]
    ];

    entries.forEach(([label, value]) => {
        const card = document.createElement('div');
        card.className = 'admin-stat-card';

        const strong = document.createElement('strong');
        strong.textContent = String(value ?? 0);

        const span = document.createElement('span');
        span.textContent = label;

        card.append(strong, span);
        deviceRegistryStats.appendChild(card);
    });
}

/** Renders the global device registry table, including type, assigned pet, status, last-seen, and remove controls. */
function renderDeviceRegistry(devices) {
    if (!deviceRegistryTableBody) return;

    deviceRegistryTableBody.replaceChildren();

    if (devices.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = 6;
        cell.className = 'muted';
        cell.textContent = 'No devices match the selected filters.';

        row.appendChild(cell);
        deviceRegistryTableBody.appendChild(row);
        return;
    }

    devices.forEach((device) => {
        const row = document.createElement('tr');

        textCell(row, device.deviceCode, '', 'Device Code');

        const typeCell = document.createElement('td');
        typeCell.textContent = device.deviceType === 'feeder'
            ? 'Automatic Feeder'
            : device.deviceType === 'collar'
                ? 'Activity Monitoring Collar'
                : device.deviceType || 'Unknown';
        typeCell.dataset.label = 'Type';
        row.appendChild(typeCell);

        textCell(
            row,
            device.pet
                ? `${device.pet.name || 'Unnamed pet'} (${device.pet.petCode || 'No pet code'})`
                : 'Unassigned',
            '',
            'Assigned Pet'
        );

        const statusCell = document.createElement('td');
        const status = document.createElement('span');
        status.className = `device-status device-status-${device.status}`;
        status.textContent = device.status || 'Unknown';
        statusCell.dataset.label = 'Status';
        statusCell.appendChild(status);
        row.appendChild(statusCell);

        textCell(
            row,
            device.lastSeenAt ? formatDateTime(device.lastSeenAt) : 'No activity reported',
            '',
            'Last Seen'
        );

        const actionsCell = document.createElement('td');
        actionsCell.className = 'admin-table-actions';
        actionsCell.dataset.label = 'Actions';

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'secondary';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeRegistryDevice(device));
        actionsCell.appendChild(removeButton);

        row.appendChild(actionsCell);
        deviceRegistryTableBody.appendChild(row);
    });
}

/** Fetches the global device registry with status and type filters and renders the summary and table. */
async function loadDeviceRegistry() {
    if (!dashboardReady || !deviceRegistryTableBody) return;

    deviceRegistryTableBody.replaceChildren();

    const loadingRow = document.createElement('tr');
    const loadingCell = document.createElement('td');

    loadingCell.colSpan = 6;
    loadingCell.className = 'muted';
    loadingCell.textContent = 'Loading the device registry...';

    loadingRow.appendChild(loadingCell);
    deviceRegistryTableBody.appendChild(loadingRow);

    if (refreshDeviceRegistryButton) refreshDeviceRegistryButton.disabled = true;

    const query = new URLSearchParams();

    if (deviceRegistryStatusFilter?.value) {
        query.set('status', deviceRegistryStatusFilter.value);
    }

    if (deviceRegistryTypeFilter?.value) {
        query.set('deviceType', deviceRegistryTypeFilter.value);
    }

    try {
        const data = await apiRequest(`/api/clinic/admin/devices?${query.toString()}`);

        renderDeviceRegistryStats(data.summary);
        renderDeviceRegistry(Array.isArray(data.devices) ? data.devices : []);

        if (deviceRegistryMessage) {
            showMessage(deviceRegistryMessage, '', '');
        }
    } catch (error) {
        if (deviceRegistryMessage) {
            showMessage(deviceRegistryMessage, error.message, 'error');
        }
    } finally {
        if (refreshDeviceRegistryButton) refreshDeviceRegistryButton.disabled = false;
    }
}

/** Confirms and deletes a device from the global registry, then reloads the list. */
async function removeRegistryDevice(device) {
    if (!device) return;

    const confirmed = window.confirm(
        `Remove device ${device.deviceCode} from the global registry? ` +
        'Its stored credential hash is deleted with it.'
    );

    if (!confirmed) return;

    try {
        await apiRequest(`/api/clinic/admin/devices/${encodeURIComponent(device.id)}`, {
            method: 'DELETE'
        });

        await loadDeviceRegistry();

        if (deviceRegistryMessage) {
            showMessage(deviceRegistryMessage, 'Device removed from the registry.', 'success');
        }
    } catch (error) {
        if (deviceRegistryMessage) {
            showMessage(deviceRegistryMessage, error.message, 'error');
        }
    }
}

/* --- System audit logs --------------------------------------------------- */

/** Renders the audit overview stat cards from the system counts. */
function renderAuditOverview(overview) {
    if (!auditOverviewStats) return;

    auditOverviewStats.replaceChildren();

    const entries = [
        ['Owners', overview?.registeredOwners],
        ['Pets', overview?.registeredPets],
        ['Staff Accounts', overview?.veterinaryStaff],
        ['Devices', overview?.registeredDevices],
        ['Vaccination Records', overview?.vaccinationRecords],
        ['Audit Entries', overview?.auditEntries]
    ];

    entries.forEach(([label, value]) => {
        const card = document.createElement('div');
        card.className = 'admin-stat-card';

        const strong = document.createElement('strong');
        strong.textContent = String(value ?? 0);

        const span = document.createElement('span');
        span.textContent = label;

        card.append(strong, span);
        auditOverviewStats.appendChild(card);
    });
}

/* Turns machine values such as SYSTEM_SETTINGS_UPDATED into readable labels. */
/** Converts SCREAMING_SNAKE_CASE values into readable title-case labels. */
function humanizeAuditValue(value) {
    return String(value || 'none')
        .split('_')
        .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
        .join(' ');
}

/** Renders audit log rows with humanized action and entity values, or an empty-state row. */
function renderAuditLogs(logs) {
    if (!auditLogsTableBody) return;

    auditLogsTableBody.replaceChildren();

    if (logs.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = 5;
        cell.className = 'muted';
        cell.textContent = 'No audit entries match the selected filters.';

        row.appendChild(cell);
        auditLogsTableBody.appendChild(row);
        return;
    }

    logs.forEach((log) => {
        const row = document.createElement('tr');

        textCell(row, formatDateTime(log.createdAt), '', 'When');
        textCell(row, log.actor ? log.actor.fullName : 'System', '', 'Actor');
        textCell(row, humanizeAuditValue(log.action), 'admin-table-action', 'Action');
        textCell(row, humanizeAuditValue(log.entityType), '', 'Record');
        textCell(row, log.summary, '', 'Details');

        auditLogsTableBody.appendChild(row);
    });
}

/** Fetches audit logs with the selected filters and renders the system overview and log table. */
async function loadAuditLogs() {
    if (!dashboardReady || !auditLogsTableBody) return;

    auditLogsTableBody.replaceChildren();

    const loadingRow = document.createElement('tr');
    const loadingCell = document.createElement('td');

    loadingCell.colSpan = 5;
    loadingCell.className = 'muted';
    loadingCell.textContent = 'Loading audit logs...';

    loadingRow.appendChild(loadingCell);
    auditLogsTableBody.appendChild(loadingRow);

    if (refreshAuditLogsButton) refreshAuditLogsButton.disabled = true;

    const query = new URLSearchParams();

    if (auditActionFilter?.value.trim()) {
        query.set('action', auditActionFilter.value.trim());
    }

    if (auditEntityTypeFilter?.value) {
        query.set('entityType', auditEntityTypeFilter.value);
    }

    if (auditSourceFilter?.value) {
        query.set('source', auditSourceFilter.value);
    }

    try {
        const data = await apiRequest(`/api/clinic/admin/audit-logs?${query.toString()}`);

        renderAuditOverview(data.systemOverview);
        renderAuditLogs(Array.isArray(data.logs) ? data.logs : []);

        if (auditLogsMessage) {
            showMessage(auditLogsMessage, '', '');
        }
    } catch (error) {
        if (auditLogsMessage) {
            showMessage(auditLogsMessage, error.message, 'error');
        }
    } finally {
        if (refreshAuditLogsButton) refreshAuditLogsButton.disabled = false;
    }
}

/* --- Administration event wiring ---------------------------------------- */

if (addVetUserButton) {
    addVetUserButton.addEventListener('click', () => openVetUserDialog(null));
}

if (refreshVetUsersButton) {
    refreshVetUsersButton.addEventListener('click', loadVeterinaryUsers);
}

if (vetUserForm) {
    vetUserForm.addEventListener('submit', submitVeterinaryUser);
}

if (vetPasswordForm) {
    vetPasswordForm.addEventListener('submit', submitVeterinaryPassword);
}

if (saveSystemSettingsButton) {
    saveSystemSettingsButton.addEventListener('click', saveSystemSettings);
}

if (refreshDeviceRegistryButton) {
    refreshDeviceRegistryButton.addEventListener('click', loadDeviceRegistry);
}

if (deviceRegistryStatusFilter) {
    deviceRegistryStatusFilter.addEventListener('change', loadDeviceRegistry);
}

if (deviceRegistryTypeFilter) {
    deviceRegistryTypeFilter.addEventListener('change', loadDeviceRegistry);
}

if (refreshAuditLogsButton) {
    refreshAuditLogsButton.addEventListener('click', loadAuditLogs);
}

if (applyAuditFiltersButton) {
    applyAuditFiltersButton.addEventListener('click', loadAuditLogs);
}

// Guard the administration sections on load: if the signed-in account is not
// an administrator, hide the sidebar entries and the sections themselves so
// a stale hidden panel can never be opened by scripting.
/** Hides administrator-only navigation and sections when the session is not an administrator. */
(function initializeAdministrationAccess() {
    if (isAdministratorSession()) return;

    document.querySelectorAll('[data-administrator-only]').forEach((node) => {
        node.hidden = true;
    });
})();

switchView('overview');
verifyVeterinarySession();
