const VeterinaryUser = require('../src/models/VeterinaryUser');
const ClinicSettings = require('../src/models/ClinicSettings');

const mongoose = require('mongoose');

let passed = 0;
let failed = 0;

/**
 * Asserts that data passes Mongoose validation for Model, tallying a pass or
 * reporting the returned validation error message.
 */
function expectValid(label, Model, data) {
    const validationError = new Model(data).validateSync({ suppressDeprecationWarning: true });

    if (validationError) {
        failed++;
        console.error(`FAIL: ${label} should be valid.`);
        console.error(validationError.message);
        return;
    }

    passed++;
    console.log(`PASS: ${label}`);
}

/**
 * Asserts that Model rejects data on expectedField, tallying a pass or reporting
 * that the expected field error was missing.
 */
function expectInvalid(label, Model, data, expectedField) {
    const validationError = new Model(data).validateSync({ suppressDeprecationWarning: true });

    if (!validationError || !validationError.errors[expectedField]) {
        failed++;
        console.error(
            `FAIL: ${label} should reject the field "${expectedField}".`
        );

        if (validationError) {
            console.error(validationError.message);
        }

        return;
    }

    passed++;
    console.log(`PASS: ${label}`);
}

const administratorId = new mongoose.Types.ObjectId();

const validVeterinaryUser = {
    fullName: 'Dr. Maria Santos',
    email: 'maria.santos@smartvet.local',
    passwordHash: 'test-hash-only',
    role: 'veterinarian',
    createdBy: administratorId
};

const validSettings = {
    key: 'global',
    clinicName: 'VetCare',
    reminderDaysBefore: 7,
    maxLoginAttempts: 10,
    sessionTimeoutMinutes: 60,
    updatedBy: administratorId
};

console.log('\n=== VETERINARY USER: VALID ===');
expectValid('VeterinaryUser accepts valid data', VeterinaryUser, validVeterinaryUser);
expectValid(
    'VeterinaryUser accepts a veterinary_staff role',
    VeterinaryUser,
    { ...validVeterinaryUser, role: 'veterinary_staff' }
);
expectValid(
    'VeterinaryUser accepts a disabled account',
    VeterinaryUser,
    { ...validVeterinaryUser, status: 'disabled', mustChangePassword: true }
);

console.log('\n=== VETERINARY USER: INVALID ===');
expectInvalid(
    'VeterinaryUser rejects an unsupported role',
    VeterinaryUser,
    { ...validVeterinaryUser, role: 'admin' },
    'role'
);
expectInvalid(
    'VeterinaryUser rejects an unsupported status',
    VeterinaryUser,
    { ...validVeterinaryUser, status: 'pending' },
    'status'
);
expectInvalid(
    'VeterinaryUser rejects an invalid gender',
    VeterinaryUser,
    { ...validVeterinaryUser, gender: 'Unknown' },
    'gender'
);
expectInvalid(
    'VeterinaryUser rejects a short full name',
    VeterinaryUser,
    { ...validVeterinaryUser, fullName: 'A' },
    'fullName'
);
expectValid(
    'VeterinaryUser accepts a normalised email',
    VeterinaryUser,
    { ...validVeterinaryUser, email: 'Maria.Santos@SmartVet.Local' }
);

console.log('\n=== CLINIC SETTINGS: VALID ===');
expectValid('ClinicSettings accepts valid data', ClinicSettings, validSettings);
expectValid(
    'ClinicSettings accepts boundary security values',
    ClinicSettings,
    {
        ...validSettings,
        reminderDaysBefore: 60,
        maxLoginAttempts: 20,
        sessionTimeoutMinutes: 1440
    }
);

console.log('\n=== CLINIC SETTINGS: INVALID ===');
expectInvalid(
    'ClinicSettings rejects an out-of-range reminder lead time',
    ClinicSettings,
    { ...validSettings, reminderDaysBefore: 61 },
    'reminderDaysBefore'
);
expectInvalid(
    'ClinicSettings rejects a login attempt limit below the minimum',
    ClinicSettings,
    { ...validSettings, maxLoginAttempts: 1 },
    'maxLoginAttempts'
);
expectInvalid(
    'ClinicSettings rejects a session timeout above the maximum',
    ClinicSettings,
    { ...validSettings, sessionTimeoutMinutes: 5000 },
    'sessionTimeoutMinutes'
);
expectInvalid(
    'ClinicSettings rejects a negative reminder lead time',
    ClinicSettings,
    { ...validSettings, reminderDaysBefore: -1 },
    'reminderDaysBefore'
);

expectInvalid(
    'ClinicSettings rejects a session timeout below the minimum',
    ClinicSettings,
    { ...validSettings, sessionTimeoutMinutes: 5 },
    'sessionTimeoutMinutes'
);

console.log('\n=== PASSWORD HASH STORAGE ===');

// The hash helper must never leak through the model's JSON transform.
const sample = new VeterinaryUser(validVeterinaryUser);
const serialized = sample.toJSON();

if (serialized.passwordHash === undefined) {
    passed++;
    console.log('PASS: VeterinaryUser JSON output omits passwordHash');
} else {
    failed++;
    console.error('FAIL: VeterinaryUser JSON output exposed passwordHash');
}

console.log('\n=== TEST SUMMARY ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total:  ${passed + failed}`);

if (failed > 0) {
    process.exitCode = 1;
} else {
    console.log('\nAll veterinary administration model tests passed.');
}
