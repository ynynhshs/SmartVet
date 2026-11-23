require('dotenv').config({ quiet: true });

const assert = require('node:assert/strict');
const { after, test } = require('node:test');
const express = require('express');
const mongoose = require('mongoose');


const VeterinaryUser = require('../src/models/VeterinaryUser');
const ClinicSettings = require('../src/models/ClinicSettings');
const Device = require('../src/models/Device');
const Pet = require('../src/models/Pet');
const AuditLog = require('../src/models/AuditLog');
const User = require('../src/models/User');
const VaccinationRecord = require('../src/models/VaccinationRecord');
const VaccineInventory = require('../src/models/VaccineInventory');
const FeedingEvent = require('../src/models/FeedingEvent');
const ActivityRecord = require('../src/models/ActivityRecord');
const Notification = require('../src/models/Notification');

const { createAccessToken } = require('../src/services/authService');
const authMiddleware = require('../src/middleware/authMiddleware');
let requireAuth = authMiddleware.requireAuth;


class MockQuery {
    constructor(value) {
        this.value = value;
    }

    select() {
        return this;
    }

    populate() {
        return this;
    }

    sort() {
        return this;
    }

    limit() {
        return this;
    }

    lean() {
        return Promise.resolve(this.value);
    }

    then(resolve, reject) {
        return Promise.resolve(this.value).then(resolve, reject);
    }
}

test('veterinary administration APIs enforce the administrator role', async () => {
    const administratorId = new mongoose.Types.ObjectId();
    const staffId = new mongoose.Types.ObjectId();
    const targetId = new mongoose.Types.ObjectId();

    const administratorUser = {
        _id: administratorId,
        role: 'veterinarian',
        status: 'active',
        fullName: 'Dr. Maria Santos'
    };

    const staffUser = {
        _id: staffId,
        role: 'veterinary_staff',
        status: 'active',
        fullName: 'Clinic Staff'
    };

    const createdAccount = {
        _id: targetId,
        fullName: 'Nurse Reyes',
        email: 'nurse.reyes@smartvet.local',
        role: 'veterinary_staff',
        status: 'active',
        mustChangePassword: true,
        dateOfBirth: null,
        gender: '',
        civilStatus: '',
        nationality: '',
        govId: '',
        occupation: '',
        phone: '',
        address: '',
        permanentAddress: '',
        licenseNumber: '',
        position: '',
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const savedSettings = {
        key: 'global',
        clinicName: 'VetCare',
        clinicEmail: '',
        clinicPhone: '',
        clinicAddress: '',
        requirePetVerification: true,
        allowOwnerRegistration: true,
        allowOwnerPinUnlock: true,
        reminderEnabled: true,
        reminderDaysBefore: 7,
        deviceTelemetryEnabled: true,
        maxLoginAttempts: 10,
        sessionTimeoutMinutes: 60
    };

    const auditEntries = [];
    let createdPayload = null;
    let updatedPayload = null;

    const originals = {
        userFindById: User.findById,
        userExists: User.exists,
        userCount: User.countDocuments,
        requireAuth: authMiddleware.requireAuth,
        vetFind: VeterinaryUser.find,
    vetFindOne: VeterinaryUser.findOne,
        vetExists: VeterinaryUser.exists,
        vetFindById: VeterinaryUser.findById,
        vetCreateAccount: VeterinaryUser.createAccount,
        vetFindOne: VeterinaryUser.findOne,
        vetFindByIdAndUpdate: VeterinaryUser.findByIdAndUpdate,
        settingsGet: ClinicSettings.getSettings,
        settingsUpdate: ClinicSettings.updateSettings,
        deviceFind: Device.find,
        deviceCount: Device.countDocuments,
        auditFind: AuditLog.find,
        auditCount: AuditLog.countDocuments,
        auditCreate: AuditLog.create,
        petCount: Pet.countDocuments,
        vaccinationCount: VaccinationRecord.countDocuments,
        vetCount: VeterinaryUser.countDocuments,
        inventoryCount: VaccineInventory.countDocuments,
        feedingCount: FeedingEvent.countDocuments,
        activityCount: ActivityRecord.countDocuments,
        notificationCount: Notification.countDocuments
    };



    // Stub requireAuth: the real middleware queries MongoDB, which is not
    // available in this unit test. It sets the identical req.user shape and
    // selects the account from the probe header.
    authMiddleware.requireAuth = ((req, _res, next) => {
        const probeId = req.get('x-probe-id') || '';
        const account = probeId === administratorId.toString()
            ? administratorUser
            : staffUser;

        req.user = { ...account, id: account._id.toString() };
        req.auth = { expiresAt: null };

        return next();
    });

    User.exists = async () => null;
    User.countDocuments = async () => 0;

    VeterinaryUser.find = () => new MockQuery([createdAccount]);
    // Duplicate detection is driven by this stub so the conflict path can be
    // exercised without a database.
    let duplicateEmailExists = false;
    VeterinaryUser.exists = async ({ email } = {}) => duplicateEmailExists
        ? { _id: new mongoose.Types.ObjectId() }
        : null;
    VeterinaryUser.countDocuments = async () => 1;

    VeterinaryUser.createAccount = async (data) => {
        createdPayload = data;
        return {
            ...createdAccount,
            ...data,
            _id: targetId,
            // createAccount resolves to a document; the route only serializes it.
            toJSON: null
        };
    };

    VeterinaryUser.findOne = () => new MockQuery(null);

    VeterinaryUser.findByIdAndUpdate = async (id, update) => {
        updatedPayload = update;
        return { ...createdAccount, ...update.$set };
    };

    ClinicSettings.getSettings = async () => savedSettings;
    ClinicSettings.updateSettings = async (changes) => ({
        ...savedSettings,
        ...changes
    });

    Device.find = () => new MockQuery([]);
    Device.countDocuments = async () => 0;

    AuditLog.find = () => new MockQuery([]);
    AuditLog.countDocuments = async () => 0;
    AuditLog.create = async (entry) => {
        auditEntries.push(entry);
        return entry;
    };

    Pet.countDocuments = async () => 0;
    VaccinationRecord.countDocuments = async () => 0;
    VaccineInventory.countDocuments = async () => 0;
    FeedingEvent.countDocuments = async () => 0;
    ActivityRecord.countDocuments = async () => 0;
    Notification.countDocuments = async () => 0;

    // Required after the stubs above: the router captures its middleware at
    // construction time, so it must see the stubbed requireAuth.
    const adminRoutes = require('../src/routes/adminRoutes');

    const app = express();
    app.use(express.json());
    app.use('/api/clinic/admin', adminRoutes);
    app.use((error, _req, res, _next) =>
        res.status(500).json({ success: false, message: error.message })
    );

    const server = app.listen(0);
    after(() => {
        server.close();
        User.findById = originals.userFindById;
        User.exists = originals.userExists;
        User.countDocuments = originals.userCount;
        authMiddleware.requireAuth = originals.requireAuth;
        VeterinaryUser.find = originals.vetFind;
        VeterinaryUser.exists = originals.vetExists;
        VeterinaryUser.createAccount = originals.vetCreateAccount;
        VeterinaryUser.findOne = originals.vetFindOne;
        VeterinaryUser.findByIdAndUpdate = originals.vetFindByIdAndUpdate;
        VeterinaryUser.countDocuments = originals.vetCount;
        ClinicSettings.getSettings = originals.settingsGet;
        ClinicSettings.updateSettings = originals.settingsUpdate;
        Device.find = originals.deviceFind;
        Device.countDocuments = originals.deviceCount;
        AuditLog.find = originals.auditFind;
        AuditLog.countDocuments = originals.auditCount;
        AuditLog.create = originals.auditCreate;
        Pet.countDocuments = originals.petCount;
        VaccinationRecord.countDocuments = originals.vaccinationCount;
        VaccineInventory.countDocuments = originals.inventoryCount;
        FeedingEvent.countDocuments = originals.feedingCount;
        ActivityRecord.countDocuments = originals.activityCount;
        Notification.countDocuments = originals.notificationCount;
    });

    await new Promise((resolve) => server.once('listening', resolve));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    const administratorHeaders = {
        Authorization: `Bearer ${createAccessToken({ _id: administratorId })}`,
        'Content-Type': 'application/json',
        'x-probe-id': administratorId.toString()
    };

    const staffHeaders = {
        Authorization: `Bearer ${createAccessToken({ _id: staffId })}`,
        'Content-Type': 'application/json',
        'x-probe-id': staffId.toString()
    };

    // --- Role gate ---------------------------------------------------------
    for (const path of ['/users', '/settings', '/devices', '/audit-logs']) {
        const response = await fetch(`${baseUrl}/api/clinic/admin${path}`, {
            headers: staffHeaders
        });

        assert.equal(response.status, 403, `${path} must reject veterinary_staff`);
    }

    // --- User listing ------------------------------------------------------
    const listResponse = await fetch(`${baseUrl}/api/clinic/admin/users`, {
        headers: administratorHeaders
    });
    const listData = await listResponse.json();

    assert.equal(listResponse.status, 200);
    assert.equal(listData.users.length, 1);
    assert.equal(listData.users[0].email, 'nurse.reyes@smartvet.local');
    assert.equal(listData.users[0].passwordHash, undefined);

    // --- User creation -----------------------------------------------------
    const createResponse = await fetch(`${baseUrl}/api/clinic/admin/users`, {
        method: 'POST',
        headers: administratorHeaders,
        body: JSON.stringify({
            fullName: 'Nurse Reyes',
            email: 'nurse.reyes@smartvet.local',
            password: 'ClinicPass123',
            role: 'veterinary_staff',
            phone: '0917 000 0000',
            mustChangePassword: true
        })
    });
    const createData = await createResponse.json();

    assert.equal(createResponse.status, 201);
    assert.equal(createData.user.fullName, 'Nurse Reyes');
    // The model's createAccount helper is stubbed, so assert the payload that
    // reached it: the administrator's id plus the submitted fields.
    // The route sets createdBy from the authenticated administrator.
    assert.equal(
        String(createdPayload.createdBy),
        administratorId.toString()
    );
    assert.equal(createdPayload.fullName, 'Nurse Reyes');
    assert.equal(createdPayload.email, 'nurse.reyes@smartvet.local');
    assert.equal(createdPayload.role, 'veterinary_staff');
    assert.equal(createdPayload.phone, '0917 000 0000');
    assert.equal(createdPayload.mustChangePassword, true);

    const duplicateResponse = await fetch(`${baseUrl}/api/clinic/admin/users`, {
        method: 'POST',
        headers: administratorHeaders,
        body: JSON.stringify({
            fullName: 'Another Nurse',
            email: 'nurse.reyes@smartvet.local',
            password: 'ClinicPass123',
            role: 'veterinary_staff'
        })
    });
    assert.equal(duplicateResponse.status, 201);

    duplicateEmailExists = true;
    const conflictResponse = await fetch(`${baseUrl}/api/clinic/admin/users`, {
        method: 'POST',
        headers: administratorHeaders,
        body: JSON.stringify({
            fullName: 'Another Nurse',
            email: 'nurse.reyes@smartvet.local',
            password: 'ClinicPass123',
            role: 'veterinary_staff'
        })
    });
    assert.equal(conflictResponse.status, 409);
    duplicateEmailExists = false;

    const invalidRoleResponse = await fetch(`${baseUrl}/api/clinic/admin/users`, {
        method: 'POST',
        headers: administratorHeaders,
        body: JSON.stringify({
            fullName: 'Bad Role',
            email: 'bad.role@smartvet.local',
            password: 'ClinicPass123',
            role: 'admin'
        })
    });
    assert.equal(invalidRoleResponse.status, 400);

    const shortPasswordResponse = await fetch(`${baseUrl}/api/clinic/admin/users`, {
        method: 'POST',
        headers: administratorHeaders,
        body: JSON.stringify({
            fullName: 'Short Password',
            email: 'short@smartvet.local',
            password: 'short',
            role: 'veterinary_staff'
        })
    });
    assert.equal(shortPasswordResponse.status, 400);

    // --- User update -------------------------------------------------------
    const updateResponse = await fetch(
        `${baseUrl}/api/clinic/admin/users/${targetId}`,
        {
            method: 'PATCH',
            headers: administratorHeaders,
            body: JSON.stringify({ status: 'disabled', phone: '0917 111 2222' })
        }
    );
    assert.equal(updateResponse.status, 200);
    assert.equal(updatedPayload.$set.status, 'disabled');
    assert.equal(updatedPayload.$set.phone, '0917 111 2222');

    // An administrator may not disable or demote their own account.
    const selfUpdateResponse = await fetch(
        `${baseUrl}/api/clinic/admin/users/${administratorId}`,
        {
            method: 'PATCH',
            headers: administratorHeaders,
            body: JSON.stringify({ status: 'disabled' })
        }
    );
    assert.equal(selfUpdateResponse.status, 409);

    // --- Settings ----------------------------------------------------------
    const settingsResponse = await fetch(`${baseUrl}/api/clinic/admin/settings`, {
        headers: administratorHeaders
    });
    const settingsData = await settingsResponse.json();

    assert.equal(settingsResponse.status, 200);
    assert.equal(settingsData.settings.clinicName, 'VetCare');

    const settingsUpdateResponse = await fetch(
        `${baseUrl}/api/clinic/admin/settings`,
        {
            method: 'PUT',
            headers: administratorHeaders,
            body: JSON.stringify({
                clinicName: 'VetCare Main',
                reminderDaysBefore: 14,
                sessionTimeoutMinutes: 120
            })
        }
    );
    const settingsUpdateData = await settingsUpdateResponse.json();

    assert.equal(settingsUpdateResponse.status, 200);
    assert.equal(settingsUpdateData.settings.clinicName, 'VetCare Main');
    assert.equal(settingsUpdateData.settings.reminderDaysBefore, 14);
    assert.equal(settingsUpdateData.settings.sessionTimeoutMinutes, 120);

    const badSettingsResponse = await fetch(
        `${baseUrl}/api/clinic/admin/settings`,
        {
            method: 'PUT',
            headers: administratorHeaders,
            body: JSON.stringify({ reminderDaysBefore: 999 })
        }
    );
    assert.equal(badSettingsResponse.status, 400);

    // --- Device registry ---------------------------------------------------
    const deviceResponse = await fetch(
        `${baseUrl}/api/clinic/admin/devices?status=active`,
        { headers: administratorHeaders }
    );
    const deviceData = await deviceResponse.json();

    assert.equal(deviceResponse.status, 200);
    assert.equal(deviceData.devices.length, 0);
    assert.equal(deviceData.summary.active, 0);

    const badDeviceFilterResponse = await fetch(
        `${baseUrl}/api/clinic/admin/devices?status=bogus`,
        { headers: administratorHeaders }
    );
    assert.equal(badDeviceFilterResponse.status, 400);

    // --- Audit logs --------------------------------------------------------
    const auditResponse = await fetch(
        `${baseUrl}/api/clinic/admin/audit-logs?entityType=user&limit=50`,
        { headers: administratorHeaders }
    );
    const auditData = await auditResponse.json();

    assert.equal(auditResponse.status, 200);
    assert.equal(auditData.count, 0);
    assert.equal(auditData.systemOverview.registeredOwners, 0);
    assert.equal(auditData.systemOverview.auditEntries, 0);

    const badAuditFilterResponse = await fetch(
        `${baseUrl}/api/clinic/admin/audit-logs?entityType=bogus`,
        { headers: administratorHeaders }
    );
    assert.equal(badAuditFilterResponse.status, 400);

    // --- Audit trail -------------------------------------------------------
    assert.ok(
        auditEntries.some((entry) => entry.action === 'VET_USER_CREATED'),
        'creating a user must write an audit entry'
    );
    assert.ok(
        auditEntries.some((entry) => entry.action === 'VET_USER_UPDATED'),
        'updating a user must write an audit entry'
    );
    assert.ok(
        auditEntries.some((entry) => entry.action === 'SYSTEM_SETTINGS_UPDATED'),
        'saving settings must write an audit entry'
    );

    auditEntries.forEach((entry) => {
        assert.equal(entry.source, 'user');
        assert.equal(entry.actorUserId.toString(), administratorId.toString());
        assert.equal(entry.entityType, entry.action === 'SYSTEM_SETTINGS_UPDATED'
            ? 'system'
            : 'user');
    });
});
