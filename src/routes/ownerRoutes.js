const express = require('express');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const { body, validationResult } = require('express-validator');

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const User = require('../models/User');
const Pet = require('../models/Pet');
const VaccinationRecord = require('../models/VaccinationRecord');
const Notification = require('../models/Notification');
const FeedingEvent = require('../models/FeedingEvent');
const ActivityRecord = require('../models/ActivityRecord');

const {
    requireAuth,
    authorizeRoles
} = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 1. Cloudinary Storage Definitions
const petPhotoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'smartvet/pets',
        allowed_formats: ['jpg', 'png', 'webp']
    }
});

const profilePhotoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'smartvet/profiles',
        allowed_formats: ['jpg', 'png', 'webp']
    }
});

const allowedPetPhotoTypes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
};

const allowedProfilePhotoTypes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
};

// 2. Multer Configurations
const petPhotoUpload = multer({
    storage: petPhotoStorage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, callback) => {
        if (!Object.prototype.hasOwnProperty.call(allowedPetPhotoTypes, file.mimetype)) {
            const error = new Error('Pet photo must be a JPG, PNG, or WebP image.');
            error.code = 'INVALID_PET_PHOTO_TYPE';
            return callback(error);
        }
        callback(null, true);
    }
});

const profilePhotoUpload = multer({
    storage: profilePhotoStorage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, callback) => {
        if (!Object.prototype.hasOwnProperty.call(allowedProfilePhotoTypes, file.mimetype)) {
            const error = new Error('Profile photo must be a JPG, PNG, or WebP image.');
            error.code = 'INVALID_PROFILE_PHOTO_TYPE';
            return callback(error);
        }
        callback(null, true);
    }
});

// 3. Handlers
function handlePetPhotoUpload(req, res, next) {
    petPhotoUpload.single('petPhoto')(req, res, (error) => {
        if (!error) return next();

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'Pet photo must not exceed 5 MB.' });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE' || error.code === 'INVALID_PET_PHOTO_TYPE') {
            return res.status(400).json({
                success: false,
                message: error.code === 'INVALID_PET_PHOTO_TYPE' ? error.message : 'Only one pet photo may be uploaded.'
            });
        }
        return next(error);
    });
}

function handleProfilePhotoUpload(req, res, next) {
    profilePhotoUpload.single('profilePhoto')(req, res, (error) => {
        if (!error) return next();

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'Profile photo must not exceed 5 MB.' });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE' || error.code === 'INVALID_PROFILE_PHOTO_TYPE') {
            return res.status(400).json({
                success: false,
                message: error.code === 'INVALID_PROFILE_PHOTO_TYPE' ? error.message : 'Only one profile photo may be uploaded.'
            });
        }
        return next(error);
    });
}

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
            .select('fullName email phone address role profilePhotoFilename profilePhotoContentType')
            .lean();

        if (!user || user.role !== 'owner') {
            return res.status(404).json({ success: false, message: 'Owner account not found.' });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: String(user._id),
                fullName: user.fullName,
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
                hasProfilePhoto: Boolean(user.profilePhotoFilename && user.profilePhotoContentType)
            }
        });
    } catch (error) {
        return next(error);
    }
});

// PATCH /api/owner/profile
router.patch('/profile', [
    body('fullName').isString().trim().isLength({ min: 2, max: 120 }),
    body('email').isString().trim().isEmail().isLength({ max: 254 }),
    body('phone').optional({ checkFalsy: true }).isString().trim().isLength({ max: 30 }),
    body('address').optional({ checkFalsy: true }).isString().trim().isLength({ max: 250 })
], async (req, res, next) => {
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
        if (typeof req.body.phone === 'string') user.phone = req.body.phone.trim();
        if (typeof req.body.address === 'string') user.address = req.body.address.trim();

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Personal information updated successfully.',
            user: {
                id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
                hasProfilePhoto: Boolean(user.profilePhotoFilename && user.profilePhotoContentType)
            }
        });
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).json({ success: false, message: 'That email address is already in use.' });
        }
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
            .populate('administeredBy', 'fullName')
            .sort({ administeredDate: -1, createdAt: -1 })
            .lean();

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