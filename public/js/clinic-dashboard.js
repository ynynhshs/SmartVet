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

const sidebarPendingCount = document.getElementById('sidebarPendingCount');

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
const vaccineInventoryForm = document.getElementById('vaccineInventoryForm');
const vaccineInventoryList = document.getElementById('vaccineInventoryList');
const vaccineInventoryMessage = document.getElementById('vaccineInventoryMessage');
const saveVaccineInventoryButton = document.getElementById('saveVaccineInventoryButton');
const refreshVaccineInventoryButton = document.getElementById('refreshVaccineInventoryButton');
const vaccinationInventorySelect = document.getElementById('vaccinationInventorySelect');
const vaccinationInventoryQuantity = document.getElementById('vaccinationInventoryQuantity');
const qrVaccinationInventorySelect = document.getElementById('qrVaccinationInventorySelect');
const qrVaccinationInventoryQuantity = document.getElementById('qrVaccinationInventoryQuantity');

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
const qrPetPhotoPlaceholder = document.getElementById('qrPetPhotoPlaceholder');
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
    inventory: document.getElementById('inventorySection'),
    reports: document.getElementById('reportsSection'),
    userManagement: document.getElementById('userManagementSection'),
    settings: document.getElementById('settingsSection'),
    deviceRegistry: document.getElementById('deviceRegistrySection'),
    auditLogs: document.getElementById('auditLogsSection')
};

let dashboardReady = false;
let approvedPets = [];

function getToken() {
    return SmartVetSession.getToken();
}

function logout() {
    SmartVetSession.clear();
    window.location.replace('/clinic/login.html');
}

function showMessage(element, message, type = '') {
    if (!element) return;

    element.textContent = message;
    element.className = `message ${type}`.trim();
}

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

function addText(parent, tag, text, className = '') {
    const element = document.createElement(tag);
    element.textContent = text;

    if (className) {
        element.className = className;
    }

    parent.appendChild(element);
    return element;
}

function createButton(label, className, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.className = className;
    button.addEventListener('click', onClick);
    return button;
}

function formatDate(value) {
    if (!value) return 'Not provided';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    return date.toLocaleDateString();
    
}

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

function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

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
        loadVaccineInventory();
        startQrScanner();
    } else {
        stopQrScanner();
    }

    if (viewName === 'pending') {
        loadPendingPets();
    }

    if (viewName === 'vaccinations') {
        loadVaccineInventory();
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

    if (viewName === 'inventory') {
        loadVaccineInventory();
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

function updatePendingCount(count) {
    if (pendingCount) {
        pendingCount.textContent = String(count);
    }

    if (sidebarPendingCount) {
        sidebarPendingCount.textContent = String(count);
    }
}

function updateApprovedCount(count) {
    approvedCount.textContent = String(count);
}

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
    } catch (error) {
        console.error('Unable to load clinic dashboard overview:', error);
    }
}

/* Pending registrations */

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

    card.appendChild(actions);
    return card;
}

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

    if (vaccinationInventorySelect.value) {
        payload.inventoryItemId = vaccinationInventorySelect.value;
        payload.inventoryQuantityUsed =
            Number(vaccinationInventoryQuantity.value);
    }

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
        vaccinationInventoryQuantity.disabled = true;
        vaccinationInventoryQuantity.value = '1';

        administeredDateInput.max = localDateString();
        nextDueDateInput.min = '';

        await loadVaccinationHistory(petId);
        await loadVaccineInventory();
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
let vaccineInventoryLots = [];

function isInventoryLotUsable(item) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return item.stockQuantity > 0 && new Date(item.expiryDate) >= today;
}

function updateVaccinationInventoryOptions() {
    [vaccinationInventorySelect, qrVaccinationInventorySelect].forEach((select) => {
        if (!select) return;

        const selectedValue = select.value;
        select.replaceChildren();
        const noInventory = document.createElement('option');
        noInventory.value = '';
        noInventory.textContent = 'Record without inventory tracking';
        select.appendChild(noInventory);

        vaccineInventoryLots.filter(isInventoryLotUsable).forEach((item) => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent =
                `${item.vaccineName} · ${item.batchNumber} · ${item.stockQuantity} dose(s)`;
            select.appendChild(option);
        });

        if (vaccineInventoryLots.some((item) =>
            item.id === selectedValue && isInventoryLotUsable(item)
        )) {
            select.value = selectedValue;
        }
    });
}

function setVaccinationInventorySelection(select, quantityInput, formPrefix) {
    if (!select || !quantityInput) return;
    const selected = vaccineInventoryLots.find((item) => item.id === select.value);
    quantityInput.disabled = !selected;
    const vaccineNameInput = document.getElementById(
        formPrefix ? `${formPrefix}VaccineName` : 'vaccineName'
    );
    const batchInput = document.getElementById(
        formPrefix ? `${formPrefix}BatchNumber` : 'batchNumber'
    );
    const manufacturerInput = document.getElementById(
        formPrefix ? `${formPrefix}Manufacturer` : 'manufacturer'
    );
    if (!selected) {
        const previous = vaccineInventoryLots.find(
            (item) => item.id === select.dataset.inventoryItemId
        );
        if (previous) {
            if (vaccineNameInput?.value === previous.vaccineName) vaccineNameInput.value = '';
            if (batchInput?.value === previous.batchNumber) batchInput.value = '';
            if (manufacturerInput?.value === previous.manufacturer) manufacturerInput.value = '';
        }
        select.dataset.inventoryItemId = '';
        return;
    }

    if (vaccineNameInput) vaccineNameInput.value = selected.vaccineName;
    if (batchInput) batchInput.value = selected.batchNumber;
    if (manufacturerInput) manufacturerInput.value = selected.manufacturer;
    select.dataset.inventoryItemId = selected.id;
}

function renderVaccineInventory() {
    if (!vaccineInventoryList) return;
    vaccineInventoryList.replaceChildren();

    if (vaccineInventoryLots.length === 0) {
        addText(vaccineInventoryList, 'p', 'No vaccine lots are recorded yet.', 'muted');
        return;
    }

    vaccineInventoryLots.forEach((item) => {
        const card = document.createElement('article');
        card.className = 'inventory-card';
        const heading = document.createElement('div');
        heading.className = 'inventory-card-heading';
        addText(heading, 'h3', item.vaccineName);
        const badge = document.createElement('span');
        badge.className = `inventory-status ${item.stockStatus.replace(/_/g, '-')}`;
        badge.textContent = item.stockStatus.replace(/_/g, ' ');
        heading.appendChild(badge);

        addText(card, 'div', `${item.manufacturer} · Lot ${item.batchNumber}`, 'muted');
        addText(card, 'p', `Expiry: ${formatDate(item.expiryDate)}`);
        addText(card, 'p', `Stock: ${item.stockQuantity} dose(s) · Low-stock alert: ${item.lowStockThreshold}`);
        if (item.notes) addText(card, 'p', item.notes, 'muted');

        const adjustForm = document.createElement('form');
        adjustForm.className = 'inventory-adjust-form';
        const amount = document.createElement('input');
        amount.type = 'number';
        amount.step = '1';
        amount.required = true;
        amount.setAttribute('aria-label', `Dose adjustment for ${item.vaccineName}`);
        amount.placeholder = '+ received / - removed';
        const reason = document.createElement('input');
        reason.type = 'text';
        reason.maxLength = 250;
        reason.required = true;
        reason.setAttribute('aria-label', `Adjustment reason for ${item.vaccineName}`);
        reason.placeholder = 'Reason';
        const adjustButton = document.createElement('button');
        adjustButton.type = 'submit';
        adjustButton.className = 'secondary';
        adjustButton.textContent = 'Adjust stock';
        adjustForm.append(amount, reason, adjustButton);
        adjustForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const quantityChange = Number(amount.value);
            if (!Number.isInteger(quantityChange) || quantityChange === 0) {
                showMessage(vaccineInventoryMessage, 'Enter a non-zero whole number of doses.', 'error');
                return;
            }

            adjustButton.disabled = true;
            try {
                await apiRequest(
                    `/api/clinic/vaccine-inventory/${encodeURIComponent(item.id)}/adjust`,
                    {
                        method: 'PATCH',
                        body: JSON.stringify({
                            quantityChange,
                            reason: reason.value.trim()
                        })
                    }
                );
                showMessage(vaccineInventoryMessage, 'Inventory adjustment saved.', 'success');
                await loadVaccineInventory();
            } catch (error) {
                showMessage(vaccineInventoryMessage, error.message, 'error');
                adjustButton.disabled = false;
            }
        });
        card.appendChild(adjustForm);

        if (item.movements.length) {
            const history = document.createElement('details');
            const summary = document.createElement('summary');
            summary.textContent = 'Recent stock movements';
            history.appendChild(summary);
            item.movements.forEach((movement) => {
                const line = document.createElement('p');
                const sign = movement.quantityChange > 0 ? '+' : '';
                line.textContent =
                    `${formatDate(movement.createdAt)} · ${movement.type.replace(/_/g, ' ')} · ${sign}${movement.quantityChange} dose(s) · ${movement.reason || 'No reason recorded'}`;
                history.appendChild(line);
            });
            card.appendChild(history);
        }
        vaccineInventoryList.appendChild(card);
    });
}

async function loadVaccineInventory() {
    if (!vaccineInventoryList) return;
    vaccineInventoryList.setAttribute('aria-busy', 'true');
    try {
        const data = await apiRequest('/api/clinic/vaccine-inventory');
        vaccineInventoryLots = Array.isArray(data.inventory) ? data.inventory : [];
        renderVaccineInventory();
        updateVaccinationInventoryOptions();
    } catch (error) {
        vaccineInventoryList.replaceChildren();
        addText(
            vaccineInventoryList,
            'p',
            error.message || 'Unable to load vaccine inventory.',
            'error'
        );
    } finally {
        vaccineInventoryList.setAttribute('aria-busy', 'false');
    }
}

if (vaccineInventoryForm) {
    vaccineInventoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        saveVaccineInventoryButton.disabled = true;
        const payload = Object.fromEntries(new FormData(vaccineInventoryForm).entries());

        try {
            const data = await apiRequest('/api/clinic/vaccine-inventory', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            vaccineInventoryForm.reset();
            document.getElementById('inventoryLowStockThreshold').value = '5';
            showMessage(vaccineInventoryMessage, data.message, 'success');
            await loadVaccineInventory();
        } catch (error) {
            showMessage(vaccineInventoryMessage, error.message, 'error');
        } finally {
            saveVaccineInventoryButton.disabled = false;
        }
    });
}

if (refreshVaccineInventoryButton) {
    refreshVaccineInventoryButton.addEventListener('click', loadVaccineInventory);
}

if (vaccinationInventorySelect) {
    vaccinationInventorySelect.addEventListener('change', () =>
        setVaccinationInventorySelection(
            vaccinationInventorySelect,
            vaccinationInventoryQuantity,
            ''
        )
    );
}

if (qrVaccinationInventorySelect) {
    qrVaccinationInventorySelect.addEventListener('change', () =>
        setVaccinationInventorySelection(
            qrVaccinationInventorySelect,
            qrVaccinationInventoryQuantity,
            'qr'
        )
    );
}

function formatReportCell(value) {
    if (value === null || value === undefined || value === '') return '—';
    const date = new Date(value);
    return !Number.isNaN(date.getTime()) &&
        /^\d{4}-\d{2}-\d{2}/.test(String(value))
        ? formatDate(value)
        : String(value);
}

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

if (clinicReportType) {
    const updateReportDateFilters = () => {
        const isInventoryReport = clinicReportType.value === 'inventory';
        clinicReportFrom.disabled = isInventoryReport;
        clinicReportTo.disabled = isInventoryReport;
        if (isInventoryReport) {
            clinicReportFrom.value = '';
            clinicReportTo.value = '';
        }
    };
    clinicReportType.addEventListener('change', updateReportDateFilters);
    updateReportDateFilters();
}

if (exportClinicReportButton) {
    exportClinicReportButton.addEventListener('click', () => {
        if (!clinicReportData) return;
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

    if (qrPetPhotoPlaceholder) {
        qrPetPhotoPlaceholder.hidden = false;
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
        if (qrPetPhotoPlaceholder) {
            qrPetPhotoPlaceholder.hidden = false;
        }
    }
}

// Display the personal information of the scanned pet's owner.
function openQrOwnerDetails() {
    if (!currentQrPet || !qrOwnerDetailsDialog) {
        return;
    }

    const owner = currentQrPet.owner;

    if (!owner) {
        if (qrScannerStatus) {
            showMessage(qrScannerStatus, 'Owner information is unavailable for this pet.', 'error');
        }
        return;
    }

    // 1. Populate the text
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

        if (qrVaccinationInventorySelect.value) {
            payload.inventoryItemId = qrVaccinationInventorySelect.value;
            payload.inventoryQuantityUsed =
                Number(qrVaccinationInventoryQuantity.value);
        }

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
            qrVaccinationInventoryQuantity.disabled = true;
            qrVaccinationInventoryQuantity.value = '1';
            await loadVaccineInventory();

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
        if (qrPetPhotoPlaceholder) {
            qrPetPhotoPlaceholder.hidden = true;
        }
    } catch {
        qrPetPhoto.removeAttribute('src');
        qrPetPhoto.hidden = true;
        if (qrPetPhotoPlaceholder) {
            qrPetPhotoPlaceholder.hidden = false;
        }
    }
}

// Stop the camera and release its hardware tracks.
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
(function initializeClinicSidebarToggle() {
    const shell = document.querySelector('.clinic-shell');
    const toggle = document.getElementById('clinicSidebarToggle');

    if (!shell || !toggle) return;

    const storageKey = 'smartvetClinicSidebarCollapsed';

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
(function initializeClinicTheme() {
    const storageKey = 'smartvetTheme';
    const optionButtons = Array.from(
        document.querySelectorAll('[data-theme-option]')
    );

    function currentTheme() {
        return document.body.dataset.theme === 'dark' ? 'dark' : 'light';
    }

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
    veterinarian: 'Veterinarian (Administrator)',
    veterinary_staff: 'Veterinary Staff'
};

let veterinaryUsers = [];

function adminRoleLabel(role) {
    return ADMIN_ROLE_LABELS[role] || role || 'Unknown';
}

// True when the signed-in account may use the administration areas.
function isAdministratorSession() {
    const user = SmartVetSession.getUser();
    return Boolean(user && ADMINISTRATOR_ONLY_ROLES.includes(user.role));
}

function openAdminDialog(dialog) {
    if (!dialog) return;

    if (typeof dialog.showModal === 'function') {
        dialog.showModal();
    } else {
        dialog.setAttribute('open', '');
    }
}

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

function setAdminSelectValue(select, value) {
    if (!select) return;

    const stringValue = value === null || value === undefined ? '' : String(value);

    select.value = stringValue;

    // Fall back to the first option when the stored value is not offered.
    if (select.value !== stringValue) {
        select.selectedIndex = 0;
    }
}

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
        textCell(row, adminRoleLabel(user.role), '', 'Role');

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
function humanizeAuditValue(value) {
    return String(value || 'none')
        .split('_')
        .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
        .join(' ');
}

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
(function initializeAdministrationAccess() {
    if (isAdministratorSession()) return;

    document.querySelectorAll('[data-administrator-only]').forEach((node) => {
        node.hidden = true;
    });
})();

switchView('overview');
verifyVeterinarySession();
