const express = require('express');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const { body, validationResult } = require('express-validator');

const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const User = require('../models/User');
const Pet = require('../models/Pet');
const VaccinationRecord = require('../models/VaccinationRecord');
const Notification = require('../models/Notification');
const PushSubscription = require('../models/PushSubscription');
const FeedingEvent = require('../models/FeedingEvent');
const ActivityRecord = require('../models/ActivityRecord');
const { attachActors } = require('../services/actorService');

const {
    requireAuth,
    authorizeRoles
} = require('../middleware/authMiddleware');

const {
    hashPin,
    isValidPin
} = require('../services/authService');

const {
    isPushConfigured,
    VAPID_PUBLIC_KEY
} = require('../services/pushService');

const router = express.Router();

// Shape a user document for the owner profile responses so the account page
// always receives every personal detail captured during registration.
function ownerProfilePayload(user) {
    const doc = user && user.toObject ? user.toObject() : user;

    return {
        id: String(doc._id),
        fullName: doc.fullName,
        email: doc.email,
        phone: doc.phone || '',
        address: doc.address || '',
        permanentAddress: doc.permanentAddress || '',
        dateOfBirth: doc.dateOfBirth
            ? new Date(doc.dateOfBirth).toISOString().slice(0, 10)
            : '',
        gender: doc.gender || '',
        civilStatus: doc.civilStatus || '',
        nationality: doc.nationality || '',
        govId: doc.govId || '',
        occupation: doc.occupation || '',
        hasProfilePhoto: Boolean(doc.profilePhotoFilename && doc.profilePhotoContentType),
        hasPin: Boolean(doc.pinHash),
        pinSetAt: doc.pinSetAt || null
    };
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 1. Cloudinary storage + multer upload for a single photo field.
const ALLOWED_PHOTO_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
};

function createPhotoUpload(folder) {
    return multer({
        storage: new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder,
                allowed_formats: ['jpg', 'png', 'webp']
            }
        }),
        limits: { fileSize: 5 * 1024 * 1024, files: 1 },
        fileFilter: (_req, file, callback) => {
            if (!Object.prototype.hasOwnProperty.call(ALLOWED_PHOTO_TYPES, file.mimetype)) {
                const error = new Error('Photo must be a JPG, PNG, or WebP image.');
                error.code = 'INVALID_PHOTO_TYPE';
                return callback(error);
            }
            callback(null, true);
        }
    });
}

// 2. Turn multer failures (wrong file type, oversized photo) into a readable
// 400 instead of letting them fall through to the 500 handler.
function createPhotoUploadHandler(upload, field, label) {
    return (req, res, next) => {
        upload.single(field)(req, res, (error) => {
            if (!error) return next();

            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: `${label} must not exceed 5 MB.`
                });
            }

            if (error.code === 'LIMIT_UNEXPECTED_FILE' || error.code === 'INVALID_PHOTO_TYPE') {
                return res.status(400).json({
                    success: false,
                    message: error.code === 'INVALID_PHOTO_TYPE'
                        ? `${label} must be a JPG, PNG, or WebP image.`
                        : `Only one ${label.toLowerCase()} may be uploaded.`
                });
            }

            return next(error);
        });
    };
}

const petPhotoUpload = createPhotoUpload('smartvet/pets');
const profilePhotoUpload = createPhotoUpload('smartvet/profiles');

const handlePetPhotoUpload = createPhotoUploadHandler(petPhotoUpload, 'petPhoto', 'Pet photo');
const handleProfilePhotoUpload = createPhotoUploadHandler(profilePhotoUpload, 'profilePhoto', 'Profile photo');

// All endpoints in this router require an authenticated pet owner.
router.use(requireAuth, authorizeRoles('owner'));

/* GET /api/owner/profile/photo */
router.get('/profile/photo', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select('role profilePhotoFilename profilePhotoContentType')
            .lean();

        if (!user || user.role !== 'owner') {
            return res.status(404).json({ success: false, message: 'Owner account not found.' });
        }

        const filename = user.profilePhotoFilename;

        if (!filename || !user.profilePhotoContentType) {
            return res.status(404).json({ success: false, message: 'No profile photo is available.' });
        }

        // If it's a Cloudinary URL, redirect straight to the image
        if (filename.startsWith('http')) {
            return res.redirect(filename);
        }

        // Legacy fallback for older local images (if they still exist)
        if (!/^[a-f0-9]{32}\.(jpg|png|webp)$/i.test(filename)) {
            return res.status(404).json({ success: false, message: 'No profile photo is available.' });
        }

        const photoPath = path.join(__dirname, '../../uploads/profile-photos', filename);

        res.set('Content-Type', user.profilePhotoContentType);
        res.set('Cache-Control', 'private, no-store');
        res.set('X-Content-Type-Options', 'nosniff');

        return res.sendFile(photoPath, (error) => {
            if (error && !res.headersSent) {
                return res.status(404).json({ success: false, message: 'Profile photo file is missing from the server.' });
            }
        });
    } catch (error) {
        return next(error);
    }
});

/* POST /api/owner/profile/photo */
router.post('/profile/photo', handleProfilePhotoUpload, async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please select a profile photo.' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'owner') {
            return res.status(404).json({ success: false, message: 'Owner account not found.' });
        }

        user.profilePhotoFilename = req.file.path; // Cloudinary URL
        user.profilePhotoContentType = req.file.mimetype;
        user.profilePhotoOriginalName = path.basename(req.file.originalname).slice(0, 255);
        user.profilePhotoSize = req.file.size;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Profile photo uploaded successfully.',
            photoUrl: '/api/owner/profile/photo'
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner/profile
router.get('/profile', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select('fullName email phone address permanentAddress dateOfBirth gender civilStatus nationality govId occupation role profilePhotoFilename profilePhotoContentType pinHash pinSetAt')
            .lean();

        if (!user || user.role !== 'owner') {
            return res.status(404).json({ success: false, message: 'Owner account not found.' });
        }

        return res.status(200).json({
            success: true,
            user: ownerProfilePayload(user)
        });
    } catch (error) {
        return next(error);
    }
});

// PATCH /api/owner/profile
// Update only the authenticated owner's personal information.
router.patch(
    '/profile',
    [
        body('fullName').isString().trim().isLength({ min: 2, max: 120 })
            .withMessage('Please enter your full name (2–120 characters).'),
        body('email').isString().trim().isEmail().isLength({ max: 254 })
            .withMessage('Please enter a valid email address.'),
        body('phone').optional({ checkFalsy: true }).isString().trim().isLength({ max: 30 })
            .withMessage('Phone number must be 30 characters or fewer.'),
        body('address').optional({ checkFalsy: true }).isString().trim().isLength({ max: 250 })
            .withMessage('Current address must be 250 characters or fewer.'),
        body('permanentAddress').optional({ checkFalsy: true }).isString().trim().isLength({ max: 250 })
            .withMessage('Permanent address must be 250 characters or fewer.'),
        body('dateOfBirth').optional({ checkFalsy: true }).isISO8601({ strict: true, strictSeparator: true })
            .withMessage('Please enter a valid date of birth.').toDate(),
        body('gender').optional({ checkFalsy: true })
            .isIn(['Male', 'Female', 'Prefer not to say'])
            .withMessage('Please select a valid gender.'),
        body('civilStatus').optional({ checkFalsy: true })
            .isIn(['Single', 'Married', 'Widowed', 'Separated'])
            .withMessage('Please select a valid civil status.'),
        body('nationality').optional({ checkFalsy: true }).isString().trim().isLength({ max: 100 })
            .withMessage('Nationality must be 100 characters or fewer.'),
        body('govId').optional({ checkFalsy: true }).isString().trim().isLength({ max: 100 })
            .withMessage('Government ID must be 100 characters or fewer.'),
        body('occupation').optional({ checkFalsy: true })
            .isIn(['Employed', 'Self-Employed', 'Student'])
            .withMessage('Please select a valid occupation.')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        try {
            const user = await User.findById(req.user.id);
            if (!user || user.role !== 'owner') {
                return res.status(404).json({ success: false, message: 'Owner account not found.' });
            }

            user.fullName = req.body.fullName.trim();
            user.email = req.body.email.trim().toLowerCase();

            // Update new fields
            if (req.body.phone !== undefined) user.phone = req.body.phone.trim();
            if (req.body.address !== undefined) user.address = req.body.address.trim();
            if (req.body.permanentAddress !== undefined) user.permanentAddress = req.body.permanentAddress.trim();
            if (req.body.dateOfBirth !== undefined) {
                user.dateOfBirth = req.body.dateOfBirth || null;
            }
            if (req.body.gender !== undefined) user.gender = req.body.gender;
            if (req.body.civilStatus !== undefined) user.civilStatus = req.body.civilStatus;
            if (req.body.nationality !== undefined) user.nationality = req.body.nationality.trim();
            if (req.body.govId !== undefined) user.govId = req.body.govId.trim();
            if (req.body.occupation !== undefined) user.occupation = req.body.occupation;

            await user.save();

            return res.status(200).json({
                success: true,
                message: 'Personal information updated successfully.',
                user: ownerProfilePayload(user)
            });
        } catch (error) {
            if (error && error.code === 11000) {
                return res.status(409).json({ success: false, message: 'That email address is already in use.' });
            }
            return next(error);
        }
    }
);

// POST /api/owner/pin
// Create or replace the owner's app-lock PIN from the Settings page.
router.post(
    '/pin',
    [
        body('pin').isString().custom((value) => isValidPin(value))
            .withMessage('PIN must be exactly 6 digits.')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        try {
            const user = await User.findById(req.user.id);

            if (!user || user.role !== 'owner') {
                return res.status(404).json({ success: false, message: 'Owner account not found.' });
            }

            user.pinHash = await hashPin(req.body.pin);
            user.pinSetAt = new Date();
            await user.save();

            return res.status(200).json({
                success: true,
                message: 'PIN saved. You can now unlock the app with this PIN.',
                hasPin: true,
                pinSetAt: user.pinSetAt
            });
        } catch (error) {
            return next(error);
        }
    }
);

// DELETE /api/owner/pin
// Removes the app-lock PIN so the owner must sign in with email and password.
router.delete('/pin', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'owner') {
            return res.status(404).json({ success: false, message: 'Owner account not found.' });
        }

        user.pinHash = null;
        user.pinSetAt = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'PIN removed.',
            hasPin: false
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner/pets/:petId/photo
router.get('/pets/:petId/photo', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.petId)) {
            return res.status(400).json({ success: false, message: 'Invalid pet ID.' });
        }

        const pet = await Pet.findOne({
            _id: req.params.petId,
            ownerUserId: req.user.id
        }).select('photoFilename photoContentType').lean();

        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found.' });
        }

        const filename = pet.photoFilename;

        if (!filename || !pet.photoContentType) {
            return res.status(404).json({ success: false, message: 'No pet photo is available.' });
        }

        // If it's a Cloudinary URL, redirect straight to the image
        if (filename.startsWith('http')) {
            return res.redirect(filename);
        }

        // Legacy fallback for older local images
        if (!/^[a-f0-9]{32}\.(jpg|png|webp)$/i.test(filename)) {
            return res.status(404).json({ success: false, message: 'Pet photo is unavailable.' });
        }

        const photoPath = path.join(__dirname, '../../uploads/pet-photos', filename);

        res.set('Content-Type', pet.photoContentType);
        res.set('Cache-Control', 'private, no-store');
        res.set('X-Content-Type-Options', 'nosniff');

        return res.sendFile(photoPath, (error) => {
            if (error && !res.headersSent) {
                return res.status(404).json({ success: false, message: 'Pet photo file is missing from the server.' });
            }
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner
router.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        area: 'owner',
        message: 'Pet owner access verified.',
        user: { id: req.user.id, fullName: req.user.fullName, role: req.user.role }
    });
});

// POST /api/owner/pets
router.post('/pets', handlePetPhotoUpload, [
    body('name').isString().trim().notEmpty().isLength({ max: 100 }),
    body('species').isString().trim().toLowerCase().isIn(['dog', 'cat', 'rabbit', 'bird', 'other']),
    body('breed').optional().isString().trim().isLength({ max: 100 }),
    body('sex').optional().isString().trim().toLowerCase().isIn(['male', 'female', 'unknown']),
    body('dateOfBirth').optional({ values: 'null' }).isISO8601({ strict: true }),
    body('color').optional().isString().trim().isLength({ max: 100 })
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Please correct the pet registration details.',
            errors: errors.array().map((error) => ({ field: error.path, message: error.msg }))
        });
    }

    try {
        const petData = {
            ownerUserId: req.user.id,
            name: req.body.name.trim(),
            species: req.body.species.trim().toLowerCase(),
            registrationStatus: 'pending'
        };

        if (req.file) {
            petData.photoFilename = req.file.path; // Cloudinary URL
            petData.photoContentType = req.file.mimetype;
            petData.photoOriginalName = path.basename(req.file.originalname).slice(0, 255);
            petData.photoSize = req.file.size;
        }

        if (req.body.breed !== undefined) petData.breed = req.body.breed.trim();
        if (req.body.sex !== undefined) petData.sex = req.body.sex.trim().toLowerCase();
        if (req.body.dateOfBirth !== undefined) petData.dateOfBirth = new Date(`${req.body.dateOfBirth}T00:00:00.000Z`);
        if (req.body.color !== undefined) petData.color = req.body.color.trim();

        const pet = await Pet.create(petData);

        return res.status(201).json({
            success: true,
            message: 'Pet registration submitted for veterinary review.',
            pet: {
                id: pet._id.toString(),
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                sex: pet.sex,
                dateOfBirth: pet.dateOfBirth || null,
                color: pet.color,
                registrationStatus: pet.registrationStatus,
                createdAt: pet.createdAt
            }
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner/pets
router.get('/pets', async (req, res, next) => {
    try {
        const pets = await Pet.find({ ownerUserId: req.user.id })
            .select('petCode name species breed sex dateOfBirth color photoFilename photoContentType registrationStatus createdAt')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: pets.length,
            pets: pets.map((pet) => ({
                id: pet._id.toString(),
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                sex: pet.sex,
                dateOfBirth: pet.dateOfBirth || null,
                color: pet.color,
                hasPhoto: Boolean(pet.photoFilename && pet.photoContentType),
                registrationStatus: pet.registrationStatus,
                ...(pet.registrationStatus === 'approved' && pet.petCode ? { petCode: pet.petCode } : {}),
                createdAt: pet.createdAt
            }))
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner/vaccinations
// Return vaccination records only for pets owned by the authenticated user.
router.get('/vaccinations', async (req, res, next) => {
    try {
        const pets = await Pet.find({
            ownerUserId: req.user.id,
            registrationStatus: 'approved'
        })
            .select('_id name species petCode')
            .lean();

        const petById = new Map(
            pets.map((pet) => [pet._id.toString(), pet])
        );
        const records = pets.length
            ? await VaccinationRecord.find({
                petId: { $in: pets.map((pet) => pet._id) }
            })
                .sort({ nextDueDate: 1, administeredDate: -1 })
                .lean()
            : [];

        await attachActors(records, 'administeredBy');

        return res.status(200).json({
            success: true,
            count: records.length,
            vaccinations: records.map((record) => {
                const pet = petById.get(record.petId.toString());

                return {
                    id: record._id.toString(),
                    pet: pet
                        ? {
                            id: pet._id.toString(),
                            name: pet.name,
                            species: pet.species,
                            petCode: pet.petCode || ''
                        }
                        : null,
                    vaccineName: record.vaccineName,
                    administeredDate: record.administeredDate,
                    nextDueDate: record.nextDueDate || null,
                    batchNumber: record.batchNumber || '',
                    manufacturer: record.manufacturer || '',
                    dosage: record.dosage || '',
                    notes: record.notes || '',
                    administeredBy: record.administeredBy?.fullName || 'Unknown'
                };
            })
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner/pets/qr/:identifier
router.get('/pets/qr/:identifier', async (req, res, next) => {
    const identifier = req.params.identifier;
    if (!/^[a-fA-F0-9]{64}$/.test(identifier)) {
        return res.status(400).json({ success: false, message: 'Invalid QR identifier format.' });
    }
    try {
        const pet = await Pet.findOne({
            qrIdentifier: identifier.toLowerCase(),
            ownerUserId: req.user.id,
            registrationStatus: 'approved'
        }).select('petCode name species breed sex dateOfBirth color registrationStatus verifiedAt').lean();

        if (!pet) {
            return res.status(404).json({ success: false, message: 'No approved pet was found for this QR code.' });
        }
        return res.status(200).json({
            success: true,
            pet: {
                id: pet._id.toString(),
                petCode: pet.petCode,
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                sex: pet.sex,
                dateOfBirth: pet.dateOfBirth || null,
                color: pet.color,
                registrationStatus: pet.registrationStatus,
                verifiedAt: pet.verifiedAt || null
            }
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner/pets/:petId/qr-image
router.get('/pets/:petId/qr-image', async (req, res, next) => {
    const { petId } = req.params;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ success: false, message: 'Invalid pet ID.' });
    }
    try {
        const pet = await Pet.findOne({
            _id: petId,
            ownerUserId: req.user.id,
            registrationStatus: 'approved'
        }).select('+qrIdentifier petCode name species').lean();

        if (!pet || !pet.qrIdentifier || !pet.petCode) {
            return res.status(404).json({ success: false, message: 'No approved pet with a QR code was found.' });
        }
        const qrCodeImage = await QRCode.toDataURL(pet.qrIdentifier, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            margin: 2,
            width: 300
        });
        return res.status(200).json({
            success: true,
            pet: { petCode: pet.petCode, name: pet.name, species: pet.species },
            qrCodeImage
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner/pets/:petId/vaccinations
router.get('/pets/:petId/vaccinations', async (req, res, next) => {
    const { petId } = req.params;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ success: false, message: 'Invalid pet ID.' });
    }
    try {
        const pet = await Pet.findOne({
            _id: petId,
            ownerUserId: req.user.id,
            registrationStatus: 'approved'
        }).select('petCode name species breed sex dateOfBirth color registrationStatus verifiedAt').lean();

        if (!pet) {
            return res.status(404).json({ success: false, message: 'Approved pet not found in your account.' });
        }
        const records = await VaccinationRecord.find({ petId: pet._id })
            .sort({ administeredDate: -1, createdAt: -1 })
            .lean();

        await attachActors(records, 'administeredBy');

        return res.status(200).json({
            success: true,
            pet: {
                id: pet._id.toString(),
                petCode: pet.petCode,
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                sex: pet.sex,
                dateOfBirth: pet.dateOfBirth || null,
                color: pet.color,
                registrationStatus: pet.registrationStatus,
                verifiedAt: pet.verifiedAt || null
            },
            count: records.length,
            vaccinations: records.map((record) => ({
                id: record._id.toString(),
                vaccineName: record.vaccineName,
                administeredDate: record.administeredDate,
                nextDueDate: record.nextDueDate || null,
                batchNumber: record.batchNumber,
                manufacturer: record.manufacturer,
                dosage: record.dosage,
                notes: record.notes,
                administeredBy: record.administeredBy ? record.administeredBy.fullName : 'Unknown',
                createdAt: record.createdAt
            }))
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner/feeding-events
router.get('/feeding-events', async (req, res, next) => {
    try {
        const allowedStatuses = ['running', 'completed', 'failed', 'cancelled'];
        const ownedPets = await Pet.find({ ownerUserId: req.user.id })
            .select('_id name species petCode registrationStatus').lean();
        const ownedPetIds = ownedPets.map((pet) => pet._id);
        const filter = { petId: { $in: ownedPetIds } };

        if (req.query.petId !== undefined) {
            if (typeof req.query.petId !== 'string' || !mongoose.isValidObjectId(req.query.petId)) {
                return res.status(400).json({ success: false, message: 'A valid pet ID is required.' });
            }
            const selectedPet = ownedPets.find((pet) => pet._id.toString() === req.query.petId);
            if (!selectedPet) {
                return res.status(404).json({ success: false, message: 'Pet not found in your account.' });
            }
            filter.petId = selectedPet._id;
        }

        if (req.query.status !== undefined) {
            if (typeof req.query.status !== 'string' || !allowedStatuses.includes(req.query.status)) {
                return res.status(400).json({ success: false, message: 'Invalid feeding event status.' });
            }
            filter.status = req.query.status;
        }

        const records = await FeedingEvent.find(filter)
            .populate('petId', 'name species petCode registrationStatus')
            .sort({ startedAt: -1 })
            .limit(200)
            .lean();

        return res.status(200).json({
            success: true,
            count: records.length,
            events: records.map((event) => ({
                id: event._id.toString(),
                eventId: event.eventId,
                pet: event.petId ? {
                    id: event.petId._id.toString(),
                    name: event.petId.name,
                    species: event.petId.species,
                    petCode: event.petId.registrationStatus === 'approved' ? event.petId.petCode : undefined
                } : null,
                source: event.source,
                status: event.status,
                requestedGrams: event.requestedGrams,
                dispensedGrams: event.dispensedGrams,
                startedAt: event.startedAt,
                completedAt: event.completedAt,
                failureReason: event.failureReason,
                createdAt: event.createdAt
            }))
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner/activity-records
router.get('/activity-records', async (req, res, next) => {
    try {
        const allowedActivities = ['walking', 'running', 'resting', 'sleeping', 'inactive', 'unknown'];
        const { petId, activity } = req.query;

        if (petId && !mongoose.isValidObjectId(petId)) {
            return res.status(400).json({ success: false, message: 'Invalid pet ID.' });
        }
        if (activity && !allowedActivities.includes(activity)) {
            return res.status(400).json({ success: false, message: 'Invalid activity classification.' });
        }

        const ownedPets = await Pet.find({ ownerUserId: req.user.id }).select('_id').lean();
        const ownedPetIds = ownedPets.map((pet) => pet._id);

        if (petId) {
            const ownsPet = ownedPetIds.some((id) => id.toString() === petId);
            if (!ownsPet) {
                return res.status(404).json({ success: false, message: 'Pet not found.' });
            }
        }

        const filter = {
            petId: petId ? new mongoose.Types.ObjectId(petId) : { $in: ownedPetIds }
        };
        if (activity) filter.activity = activity;

        const records = await ActivityRecord.find(filter)
            .populate('petId', 'name species petCode')
            .populate('deviceId', 'deviceCode deviceType')
            .sort({ measuredAt: -1 })
            .limit(200)
            .lean();

        return res.status(200).json({
            success: true,
            count: records.length,
            records: records.map((record) => ({
                id: record._id.toString(),
                pet: record.petId ? {
                    id: record.petId._id.toString(),
                    name: record.petId.name,
                    species: record.petId.species,
                    petCode: record.petId.petCode || null
                } : null,
                device: record.deviceId ? {
                    id: record.deviceId._id.toString(),
                    deviceCode: record.deviceId.deviceCode,
                    deviceType: record.deviceId.deviceType
                } : null,
                activity: record.activity,
                measuredAt: record.measuredAt,
                durationSeconds: record.durationSeconds ?? null,
                sensorSummary: record.sensorSummary ?? null,
                createdAt: record.createdAt
            }))
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner/push-subscription
// Tells the owner dashboard whether push is configured and if this account
// already has a browser subscribed.
router.get('/push-subscription', async (req, res, next) => {
    try {
        const subscriptionCount = await PushSubscription.countDocuments({
            userId: req.user.id
        });

        return res.status(200).json({
            success: true,
            supported: isPushConfigured(),
            vapidPublicKey: VAPID_PUBLIC_KEY,
            isSubscribed: subscriptionCount > 0,
            subscriptionCount
        });
    } catch (error) {
        return next(error);
    }
});

// POST /api/owner/push-subscription
// Stores (or refreshes) a browser push subscription for the signed-in owner.
router.post(
    '/push-subscription',
    async (req, res, next) => {
        const endpoint = req.body && req.body.endpoint;
        const keys = req.body && req.body.keys;
        const expirationTime = req.body && req.body.expirationTime;

        const isValidEndpoint = typeof endpoint === 'string'
            && endpoint.trim().length > 0
            && endpoint.length <= 500
            && /^https?:\/\//i.test(endpoint.trim());

        const isValidKeys = keys
            && typeof keys.p256dh === 'string'
            && keys.p256dh.trim().length > 0
            && typeof keys.auth === 'string'
            && keys.auth.trim().length > 0;

        if (!isValidEndpoint) {
            return res.status(400).json({
                success: false,
                message: 'A valid push endpoint (http/https) is required.'
            });
        }

        if (!isValidKeys) {
            return res.status(400).json({
                success: false,
                message: 'Push encryption keys are missing.'
            });
        }

        try {

            await PushSubscription.findOneAndUpdate(
                { endpoint },
                {
                    userId: req.user.id,
                    endpoint,
                    keys: {
                        p256dh: keys.p256dh,
                        auth: keys.auth
                    },
                    expirationTime: expirationTime ? new Date(expirationTime) : null
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            return res.status(201).json({
                success: true,
                message: 'Browser notifications enabled.'
            });
        } catch (error) {
            return next(error);
        }
    }
);

// DELETE /api/owner/push-subscription
// Removes one subscription (when an endpoint is supplied) or all of them.
router.delete('/push-subscription', async (req, res, next) => {
    try {
        const endpoint = req.body && req.body.endpoint;

        if (endpoint) {
            await PushSubscription.deleteOne({
                userId: req.user.id,
                endpoint
            });
        } else {
            await PushSubscription.deleteMany({ userId: req.user.id });
        }

        return res.status(200).json({
            success: true,
            message: 'Browser notifications disabled.'
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/owner/notifications
router.get('/notifications', async (req, res, next) => {
    try {
        const [notifications, unreadCount] = await Promise.all([
            Notification.find({ userId: req.user.id })
                .select('type title message petId relatedRecordType relatedRecordId priority readAt createdAt')
                .populate('petId', 'name petCode')
                .sort({ createdAt: -1 })
                .limit(50)
                .lean(),
            Notification.countDocuments({ userId: req.user.id, readAt: null })
        ]);

        return res.status(200).json({
            success: true,
            unreadCount,
            count: notifications.length,
            notifications: notifications.map((notification) => ({
                id: notification._id.toString(),
                type: notification.type,
                title: notification.title,
                message: notification.message,
                priority: notification.priority,
                read: Boolean(notification.readAt),
                readAt: notification.readAt || null,
                createdAt: notification.createdAt,
                pet: notification.petId ? {
                    name: notification.petId.name,
                    petCode: notification.petId.petCode
                } : null,
                relatedRecordType: notification.relatedRecordType || null,
                relatedRecordId: notification.relatedRecordId ? notification.relatedRecordId.toString() : null
            }))
        });
    } catch (error) {
        return next(error);
    }
});

// PATCH /api/owner/notifications/:notificationId/read
router.patch('/notifications/:notificationId/read', async (req, res, next) => {
    const { notificationId } = req.params;
    if (!mongoose.isValidObjectId(notificationId)) {
        return res.status(400).json({ success: false, message: 'Invalid notification ID.' });
    }
    try {
        const notification = await Notification.findOne({ _id: notificationId, userId: req.user.id });
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }
        if (!notification.readAt) {
            notification.readAt = new Date();
            await notification.save();
        }
        return res.status(200).json({
            success: true,
            message: 'Notification marked as read.',
            notification: { id: notification._id.toString(), read: true, readAt: notification.readAt }
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;