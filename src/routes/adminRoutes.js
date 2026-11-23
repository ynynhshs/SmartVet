const express = require('express');
const mongoose = require('mongoose');
const { body, query, validationResult } = require('express-validator');

const VeterinaryUser = require('../models/VeterinaryUser');
const ClinicSettings = require('../models/ClinicSettings');
const Device = require('../models/Device');
const Pet = require('../models/Pet');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const VaccinationRecord = require('../models/VaccinationRecord');
const FeedingEvent = require('../models/FeedingEvent');
const ActivityRecord = require('../models/ActivityRecord');
const Notification = require('../models/Notification');
const { hashPassword } = require('../services/authService');
const { attachActors } = require('../services/actorService');

const {
    requireAuth,
    authorizeRoles
} = require('../middleware/authMiddleware');

const router = express.Router();

// Every administrator endpoint requires an authenticated veterinary account
// holding the administrator role. The role is read from MongoDB by
// requireAuth, never from the token payload or the browser.
router.use(requireAuth, authorizeRoles('veterinarian', 'veterinary_staff', 'veterinary'));

const ADMINISTRATOR_ROLE = 'veterinarian';

/**
 * Allow only the `veterinarian` administrator role through. Responds 403 for
 * other veterinary staff; must run after `requireAuth`.
 */
function requireAdministrator(req, res, next) {
    if (req.user.role !== ADMINISTRATOR_ROLE) {
        return res.status(403).json({
            success: false,
            message: 'Only the veterinary administrator can manage user accounts, system settings, the global device registry, and audit logs.'
        });
    }

    return next();
}

/**
 * Write a 400 JSON response listing field-level validation errors and return
 * false, or return true when the request is valid.
 */
function validateRequest(req, res) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return true;
    }

    res.status(400).json({
        success: false,
        message: 'Please correct the submitted information.',
        errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg
        }))
    });

    return false;
}

/**
 * Shape a VeterinaryUser document for admin responses, exposing only safe fields
 * and resolving `createdBy` to a display name without leaking the password hash.
 */
function serializeVeterinaryUser(account) {
    const createdBy = account.createdBy;

    return {
        id: account._id.toString(),
        fullName: account.fullName,
        email: account.email,
        role: account.role,
        dateOfBirth: account.dateOfBirth || null,
        gender: account.gender || '',
        civilStatus: account.civilStatus || '',
        nationality: account.nationality || '',
        govId: account.govId || '',
        occupation: account.occupation || '',
        phone: account.phone || '',
        address: account.address || '',
        permanentAddress: account.permanentAddress || '',
        licenseNumber: account.licenseNumber || '',
        position: account.position || '',
        status: account.status,
        mustChangePassword: Boolean(account.mustChangePassword),
        lastLoginAt: account.lastLoginAt || null,
        createdBy: createdBy
            ? (createdBy.fullName || String(createdBy._id))
            : null,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
    };
}

// Record an administrator action in the audit trail.
/**
 * Append an administrator action to the audit trail. Failures are logged and
 * swallowed so auditing never makes the requested action fail.
 */
async function writeAdminAudit(req, action, summary, entityType = 'user', entityId = undefined) {
    try {
        await AuditLog.create({
            actorUserId: req.user.id,
            source: 'user',
            action,
            entityType,
            entityId,
            summary,
            requestId: req.id || ''
        });
    } catch (error) {
        // Auditing must never make the requested action fail.
        console.error('Unable to write administrator audit log:', error.message);
    }
}

// ---------------------------------------------------------------------------
// User account management
// ---------------------------------------------------------------------------

// GET /api/clinic/admin/users
// List every veterinary staff account.
/**
 * List veterinary staff accounts (newest first, max 500) with their creator
 * resolved across both account collections.
 */
router.get('/users', requireAdministrator, async (req, res, next) => {
    try {
        const accounts = await VeterinaryUser.find({})
            .sort({ createdAt: -1 })
            .limit(500)
            .lean();

        await attachActors(accounts, 'createdBy');

        return res.status(200).json({
            success: true,
            count: accounts.length,
            users: accounts.map(serializeVeterinaryUser)
        });
    } catch (error) {
        return next(error);
    }
});

// POST /api/clinic/admin/users
// Provision a new veterinary staff account.
/**
 * Provision a veterinary staff account. Rejects emails already used in either
 * collection, hashes the password, records an audit entry, and returns the
 * serialized account.
 */
router.post(
    '/users',
    requireAdministrator,
    [
        body('fullName')
            .isString()
            .withMessage('Full name is required.')
            .bail()
            .trim()
            .isLength({ min: 2, max: 120 })
            .withMessage('Full name must be 2 to 120 characters.'),

        body('email')
            .isString()
            .withMessage('Email address is required.')
            .bail()
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .bail()
            .isLength({ max: 254 })
            .withMessage('Email address must be 254 characters or fewer.'),

        body('password')
            .isString()
            .withMessage('Password is required.')
            .bail()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters.')
            .bail()
            .custom((value) => Buffer.byteLength(value, 'utf8') <= 72)
            .withMessage('Password must be 72 bytes or fewer.'),

        body('role')
            .isString()
            .withMessage('Role is required.')
            .bail()
            .trim()
            .isIn(['veterinarian', 'veterinary_staff'])
            .withMessage('Role must be veterinarian or veterinary_staff.'),

        body('dateOfBirth')
            .optional({ checkFalsy: true })
            .isISO8601({ strict: true })
            .withMessage('Date of birth must use YYYY-MM-DD format.'),

        body('gender')
            .optional()
            .isString()
            .isIn(['Male', 'Female', 'Prefer not to say', ''])
            .withMessage('Please choose a valid gender option.'),

        body('civilStatus')
            .optional()
            .isString()
            .isIn(['Single', 'Married', 'Widowed', 'Separated', ''])
            .withMessage('Please choose a valid civil status.'),

        body('nationality')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Nationality must be 100 characters or fewer.'),

        body('govId')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Government ID must be 100 characters or fewer.'),

        body('occupation')
            .optional()
            .isString()
            .isIn(['Employed', 'Self-Employed', 'Student', ''])
            .withMessage('Please choose a valid occupation.'),

        body('phone')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 30 })
            .withMessage('Phone number must be 30 characters or fewer.'),

        body('address')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 250 })
            .withMessage('Address must be 250 characters or fewer.'),

        body('permanentAddress')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 250 })
            .withMessage('Permanent address must be 250 characters or fewer.'),

        body('licenseNumber')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 100 })
            .withMessage('License number must be 100 characters or fewer.'),

        body('position')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 120 })
            .withMessage('Position must be 120 characters or fewer.'),

        body('mustChangePassword')
            .optional()
            .isBoolean()
            .withMessage('mustChangePassword must be true or false.')
    ],
    async (req, res, next) => {
        if (!validateRequest(req, res)) {
            return;
        }

        const email = req.body.email.trim().toLowerCase();

        // The veterinary and owner collections must not share an email:
        // /clinic/login.html and /login.html would otherwise be able to sign
        // into the same address with different passwords.
        try {
            const [existingStaff, existingOwner] = await Promise.all([
                VeterinaryUser.exists({ email }),
                User.exists({ email })
            ]);

            if (existingStaff || existingOwner) {
                return res.status(409).json({
                    success: false,
                    message: 'An account with this email address already exists.'
                });
            }

            const account = await VeterinaryUser.createAccount({
                ...req.body,
                email,
                createdBy: req.user.id,
                role: req.body.role,
                fullName: req.body.fullName.trim(),
                phone: req.body.phone?.trim() || '',
                mustChangePassword: Boolean(req.body.mustChangePassword)
            });

            await writeAdminAudit(
                req,
                'VET_USER_CREATED',
                `Created ${account.role} account for ${account.fullName} (${account.email}).`,
                'user',
                account._id
            );

            return res.status(201).json({
                success: true,
                message: 'User account created successfully.',
                user: serializeVeterinaryUser(account)
            });
        } catch (error) {
            if (error && error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'An account with this email address already exists.'
                });
            }

            if (error && error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'The user account failed validation.'
                });
            }

            return next(error);
        }
    }
);

// PATCH /api/clinic/admin/users/:userId
// Update a staff account's personal information, role, or access status.
/**
 * Update a staff account's editable fields. Blocks email reuse across both
 * collections and prevents an administrator from changing their own role or
 * status; records an audit entry.
 */
router.patch(
    '/users/:userId',
    requireAdministrator,
    [
        body('fullName')
            .optional()
            .isString()
            .withMessage('Full name must be text.')
            .bail()
            .trim()
            .isLength({ min: 2, max: 120 })
            .withMessage('Full name must be 2 to 120 characters.'),

        body('email')
            .optional()
            .isString()
            .withMessage('Email address must be text.')
            .bail()
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email address.'),

        body('role')
            .optional()
            .isString()
            .withMessage('Role must be text.')
            .bail()
            .trim()
            .isIn(['veterinarian', 'veterinary_staff'])
            .withMessage('Role must be veterinarian or veterinary_staff.'),

        body('status')
            .optional()
            .isString()
            .withMessage('Status must be text.')
            .bail()
            .trim()
            .isIn(['active', 'disabled'])
            .withMessage('Status must be active or disabled.'),

        body('dateOfBirth')
            .optional({ checkFalsy: true })
            .isISO8601({ strict: true })
            .withMessage('Date of birth must use YYYY-MM-DD format.'),

        body('gender')
            .optional()
            .isString()
            .isIn(['Male', 'Female', 'Prefer not to say', ''])
            .withMessage('Please choose a valid gender option.'),

        body('civilStatus')
            .optional()
            .isString()
            .isIn(['Single', 'Married', 'Widowed', 'Separated', ''])
            .withMessage('Please choose a valid civil status.'),

        body('nationality')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Nationality must be 100 characters or fewer.'),

        body('govId')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Government ID must be 100 characters or fewer.'),

        body('occupation')
            .optional()
            .isString()
            .isIn(['Employed', 'Self-Employed', 'Student', ''])
            .withMessage('Please choose a valid occupation.'),

        body('phone')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 30 })
            .withMessage('Phone number must be 30 characters or fewer.'),

        body('address')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 250 })
            .withMessage('Address must be 250 characters or fewer.'),

        body('permanentAddress')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 250 })
            .withMessage('Permanent address must be 250 characters or fewer.'),

        body('licenseNumber')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 100 })
            .withMessage('License number must be 100 characters or fewer.'),

        body('position')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 120 })
            .withMessage('Position must be 120 characters or fewer.'),

        body('mustChangePassword')
            .optional()
            .isBoolean()
            .withMessage('mustChangePassword must be true or false.')
    ],
    async (req, res, next) => {
        if (!validateRequest(req, res)) {
            return;
        }

        if (!mongoose.isValidObjectId(req.params.userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user account ID.'
            });
        }

        const editableFields = [
            'fullName', 'email', 'role', 'status', 'dateOfBirth', 'gender',
            'civilStatus', 'nationality', 'govId', 'occupation', 'phone',
            'address', 'permanentAddress', 'licenseNumber', 'position',
            'mustChangePassword'
        ];

        const updates = {};
        editableFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No account details were provided.'
            });
        }

        try {
            if (updates.email) {
                const email = updates.email.trim().toLowerCase();
                const [existingStaff, existingOwner] = await Promise.all([
                    VeterinaryUser.findOne({
                        email,
                        _id: { $ne: req.params.userId }
                    }).select('_id'),
                    User.exists({ email })
                ]);

                if (existingStaff || existingOwner) {
                    return res.status(409).json({
                        success: false,
                        message: 'An account with this email address already exists.'
                    });
                }

                updates.email = email;
            }

            // The administrator cannot demote or disable their own account,
            // which would lock the clinic out of every administrator area.
            if (
                req.params.userId === req.user.id &&
                (updates.status === 'disabled' || updates.role !== undefined)
            ) {
                return res.status(409).json({
                    success: false,
                    message: 'You cannot change the role or status of your own account.'
                });
            }

            updates.updatedBy = req.user.id;

            const account = await VeterinaryUser.findByIdAndUpdate(
                req.params.userId,
                { $set: updates },
                { new: true, runValidators: true }
            );

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'User account not found.'
                });
            }

            await writeAdminAudit(
                req,
                'VET_USER_UPDATED',
                `Updated the ${account.role} account for ${account.fullName} (${account.email}).`,
                'user',
                account._id
            );

            return res.status(200).json({
                success: true,
                message: 'User account updated successfully.',
                user: serializeVeterinaryUser(account)
            });
        } catch (error) {
            if (error && error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'An account with this email address already exists.'
                });
            }

            if (error && error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'The user account failed validation.'
                });
            }

            return next(error);
        }
    }
);

// POST /api/clinic/admin/users/:userId/password
// Reset a staff account's password. The new password is written once and is
// never returned to the browser.
/**
 * Reset a staff account's password and optionally force a change at next
 * sign-in. The new password is never returned to the browser.
 */
router.post(
    '/users/:userId/password',
    requireAdministrator,
    [
        body('password')
            .isString()
            .withMessage('Password is required.')
            .bail()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters.')
            .bail()
            .custom((value) => Buffer.byteLength(value, 'utf8') <= 72)
            .withMessage('Password must be 72 bytes or fewer.'),

        body('mustChangePassword')
            .optional()
            .isBoolean()
            .withMessage('mustChangePassword must be true or false.')
    ],
    async (req, res, next) => {
        if (!validateRequest(req, res)) {
            return;
        }

        if (!mongoose.isValidObjectId(req.params.userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user account ID.'
            });
        }

        try {
            const account = await VeterinaryUser.findById(req.params.userId);

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'User account not found.'
                });
            }

            account.passwordHash = await hashPassword(req.body.password);
            account.mustChangePassword = req.body.mustChangePassword !== undefined
                ? Boolean(req.body.mustChangePassword)
                : true;
            account.updatedBy = req.user.id;

            await account.save();

            await writeAdminAudit(
                req,
                'VET_USER_PASSWORD_RESET',
                `Reset the password for ${account.fullName} (${account.email}).`,
                'user',
                account._id
            );

            return res.status(200).json({
                success: true,
                message: 'Password updated successfully.'
            });
        } catch (error) {
            if (error && error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return next(error);
        }
    }
);

// DELETE /api/clinic/admin/users/:userId
// Remove a staff account that has never signed in.
/**
 * Delete a staff account that has never signed in. Refuses self-deletion and
 * accounts with a `lastLoginAt`, which must be disabled instead.
 */
router.delete('/users/:userId', requireAdministrator, async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.userId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user account ID.'
        });
    }

    if (req.params.userId === req.user.id) {
        return res.status(409).json({
            success: false,
            message: 'You cannot delete your own account.'
        });
    }

    try {
        const account = await VeterinaryUser.findById(req.params.userId);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'User account not found.'
            });
        }

        if (account.lastLoginAt) {
            return res.status(409).json({
                success: false,
                message: 'This account has already signed in. Disable it instead of deleting it.'
            });
        }

        await VeterinaryUser.deleteOne({ _id: account._id });

        await writeAdminAudit(
            req,
            'VET_USER_DELETED',
            `Deleted the unused ${account.role} account for ${account.fullName} (${account.email}).`,
            'user',
            account._id
        );

        return res.status(200).json({
            success: true,
            message: 'User account deleted successfully.'
        });
    } catch (error) {
        return next(error);
    }
});

// ---------------------------------------------------------------------------
// System settings
// ---------------------------------------------------------------------------

// GET /api/clinic/admin/settings
/**
 * Return the singleton clinic settings document (created on first read).
 */
router.get('/settings', requireAdministrator, async (req, res, next) => {
    try {
        const settings = await ClinicSettings.getSettings();

        return res.status(200).json({
            success: true,
            settings
        });
    } catch (error) {
        return next(error);
    }
});

// PUT /api/clinic/admin/settings
/**
 * Apply a partial update to the singleton clinic settings and record an audit
 * entry. At least one editable field must be supplied.
 */
router.put(
    '/settings',
    requireAdministrator,
    [
        body('clinicName')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 120 })
            .withMessage('Clinic name must be 120 characters or fewer.'),

        body('clinicEmail')
            .optional({ checkFalsy: true })
            .isString()
            .trim()
            .isEmail()
            .withMessage('Please enter a valid clinic email address.'),

        body('clinicPhone')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 30 })
            .withMessage('Clinic phone must be 30 characters or fewer.'),

        body('clinicAddress')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 250 })
            .withMessage('Clinic address must be 250 characters or fewer.'),

        body('requirePetVerification')
            .optional()
            .isBoolean()
            .withMessage('requirePetVerification must be true or false.'),

        body('allowOwnerRegistration')
            .optional()
            .isBoolean()
            .withMessage('allowOwnerRegistration must be true or false.'),

        body('allowOwnerPinUnlock')
            .optional()
            .isBoolean()
            .withMessage('allowOwnerPinUnlock must be true or false.'),

        body('reminderEnabled')
            .optional()
            .isBoolean()
            .withMessage('reminderEnabled must be true or false.'),

        body('reminderDaysBefore')
            .optional()
            .isInt({ min: 0, max: 60 })
            .withMessage('Reminder lead time must be 0 to 60 days.'),

        body('deviceTelemetryEnabled')
            .optional()
            .isBoolean()
            .withMessage('deviceTelemetryEnabled must be true or false.'),

        body('maxLoginAttempts')
            .optional()
            .isInt({ min: 3, max: 20 })
            .withMessage('Login attempt limit must be 3 to 20.'),

        body('sessionTimeoutMinutes')
            .optional()
            .isInt({ min: 15, max: 1440 })
            .withMessage('Session timeout must be 15 to 1440 minutes.')
    ],
    async (req, res, next) => {
        if (!validateRequest(req, res)) {
            return;
        }

        const editableFields = [
            'clinicName', 'clinicEmail', 'clinicPhone', 'clinicAddress',
            'requirePetVerification', 'allowOwnerRegistration',
            'allowOwnerPinUnlock', 'reminderEnabled', 'reminderDaysBefore',
            'deviceTelemetryEnabled', 'maxLoginAttempts',
            'sessionTimeoutMinutes'
        ];

        const updates = {};
        editableFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No settings were provided.'
            });
        }

        try {
            updates.updatedBy = req.user.id;

            const settings = await ClinicSettings.updateSettings(updates);

            await writeAdminAudit(
                req,
                'SYSTEM_SETTINGS_UPDATED',
                'Updated clinic system settings.',
                'system'
            );

            return res.status(200).json({
                success: true,
                message: 'System settings saved successfully.',
                settings
            });
        } catch (error) {
            if (error && error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'The settings failed validation.'
                });
            }

            return next(error);
        }
    }
);

// ---------------------------------------------------------------------------
// Global IoT device registry
// ---------------------------------------------------------------------------

// GET /api/clinic/admin/devices
// Device registry with optional status and type filters.
/**
 * List devices with optional status/deviceType filters plus per-status counts.
 * Credential hashes are never included.
 */
router.get(
    '/devices',
    requireAdministrator,
    [
        query('status')
            .optional()
            .isIn(['active', 'disabled', 'revoked'])
            .withMessage('Status must be active, disabled, or revoked.'),
        query('deviceType')
            .optional()
            .isIn(['feeder', 'collar'])
            .withMessage('Device type must be feeder or collar.')
    ],
    async (req, res, next) => {
        if (!validateRequest(req, res)) {
            return;
        }

        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.deviceType) filter.deviceType = req.query.deviceType;

        try {
            const [devices, activeCount, disabledCount, revokedCount] = await Promise.all([
                Device.find(filter)
                    .populate('petId', 'name petCode species')
                    .sort({ createdAt: -1 })
                    .limit(500)
                    .lean(),

                Device.countDocuments({ status: 'active' }),
                Device.countDocuments({ status: 'disabled' }),
                Device.countDocuments({ status: 'revoked' })
            ]);

            await attachActors(devices, 'createdBy');

            return res.status(200).json({
                success: true,
                count: devices.length,
                summary: {
                    active: activeCount,
                    disabled: disabledCount,
                    revoked: revokedCount
                },
                devices: devices.map((device) => ({
                    id: device._id.toString(),
                    deviceCode: device.deviceCode,
                    deviceType: device.deviceType,
                    status: device.status,
                    pet: device.petId
                        ? {
                            id: device.petId._id.toString(),
                            name: device.petId.name,
                            petCode: device.petId.petCode,
                            species: device.petId.species
                        }
                        : null,
                    firmwareVersion: device.firmwareVersion || '',
                    description: device.description || '',
                    lastSeenAt: device.lastSeenAt || null,
                    lastSyncAt: device.lastSyncAt || null,
                    createdBy: device.createdBy
                        ? {
                            id: device.createdBy._id.toString(),
                            fullName: device.createdBy.fullName
                        }
                        : null,
                    createdAt: device.createdAt,
                    updatedAt: device.updatedAt
                }))
            });
        } catch (error) {
            return next(error);
        }
    }
);

// DELETE /api/clinic/admin/devices/:deviceId
// Remove a device from the global registry.
/**
 * Remove a device from the global registry and record an audit entry.
 */
router.delete(
    '/devices/:deviceId',
    requireAdministrator,
    async (req, res, next) => {
        if (!mongoose.isValidObjectId(req.params.deviceId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid device ID.'
            });
        }

        try {
            const device = await Device.findById(req.params.deviceId);

            if (!device) {
                return res.status(404).json({
                    success: false,
                    message: 'Device not found.'
                });
            }

            await Device.deleteOne({ _id: device._id });

            await writeAdminAudit(
                req,
                'DEVICE_DELETED',
                `Removed device ${device.deviceCode} from the global registry.`,
                'device',
                device._id
            );

            return res.status(200).json({
                success: true,
                message: 'Device removed from the registry.'
            });
        } catch (error) {
            return next(error);
        }
    }
);

// ---------------------------------------------------------------------------
// System audit logs
// ---------------------------------------------------------------------------

// GET /api/clinic/admin/audit-logs
/**
 * List audit entries (newest first, limit 500) with optional action, entity type
 * and source filters. Always excludes collar activity telemetry and includes a
 * system-wide document count overview.
 */
router.get(
    '/audit-logs',
    requireAdministrator,
    [
        query('action')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Action filter must be 100 characters or fewer.'),
        query('entityType')
            .optional()
            .isIn([
                'user', 'pet', 'vaccination_record', 'feeding_schedule',
                'feeding_event', 'device', 'notification',
                'system', 'none'
            ])
            .withMessage('Choose a valid record type.'),
        query('source')
            .optional()
            .isIn(['user', 'system', 'device'])
            .withMessage('Source must be user, system, or device.'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 500 })
            .withMessage('Limit must be 1 to 500.')
    ],
    async (req, res, next) => {
        if (!validateRequest(req, res)) {
            return;
        }

        const filter = {};
        if (req.query.action) {
            filter.action = req.query.action.trim().toUpperCase();
        }
        if (req.query.entityType) filter.entityType = req.query.entityType;
        if (req.query.source) filter.source = req.query.source;

        // Activity-monitoring telemetry comes from collars, not from staff
        // actions, so it stays out of the clinic audit trail.
        filter.entityType = { $ne: 'activity_record' };

        const limit = Number(req.query.limit) || 100;

        try {
            const [logs, total, overview] = await Promise.all([
                // Audit actors are veterinary staff. Resolved after the query
                // with `attachActors`, because a populate cannot span the owner
                // and staff collections.
                AuditLog.find(filter)
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .lean(),

                AuditLog.countDocuments(filter),

                Promise.all([
                    User.countDocuments({}),
                    Pet.countDocuments({}),
                    Device.countDocuments({}),
                    VaccinationRecord.countDocuments({}),
                    VeterinaryUser.countDocuments({}),
                    FeedingEvent.countDocuments({}),
                    ActivityRecord.countDocuments({}),
                    Notification.countDocuments({}),
                    // Keep the overview in step with the audit trail, which
                    // never shows activity-monitoring telemetry.
                    AuditLog.countDocuments({ entityType: { $ne: 'activity_record' } })
                ])
            ]);

            const [
                ownerCount, petCount, deviceCount, vaccinationCount,
                staffCount, feedingCount, activityCount,
                notificationCount, auditCount
            ] = overview;

            await attachActors(logs, 'actorUserId');

            return res.status(200).json({
                success: true,
                count: logs.length,
                total,
                filters: {
                    action: req.query.action || '',
                    entityType: req.query.entityType || '',
                    source: req.query.source || ''
                },
                systemOverview: {
                    registeredOwners: ownerCount,
                    registeredPets: petCount,
                    registeredDevices: deviceCount,
                    vaccinationRecords: vaccinationCount,
                    veterinaryStaff: staffCount,
                    feedingEvents: feedingCount,
                    activityRecords: activityCount,
                    notifications: notificationCount,
                    auditEntries: auditCount
                },
                logs: logs.map((log) => ({
                    id: log._id.toString(),
                    action: log.action,
                    entityType: log.entityType,
                    entityId: log.entityId ? log.entityId.toString() : null,
                    summary: log.summary,
                    source: log.source,
                    actor: log.actorUserId,
                    requestId: log.requestId || '',
                    createdAt: log.createdAt
                }))
            });
        } catch (error) {
            return next(error);
        }
    }
);

module.exports = router;
