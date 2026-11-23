const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const QRCode = require('qrcode');
const path = require('path');

const Pet = require('../models/Pet');
const VaccinationRecord = require('../models/VaccinationRecord');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const VaccineInventory = require('../models/VaccineInventory');
const { clinicDateString } = require('../utils/clinicDate');
const { attachActors } = require('../services/actorService');

const {
    requireAuth,
    authorizeRoles
} = require('../middleware/authMiddleware');

const router = express.Router();

// All routes in this file require a logged-in veterinary user.
router.use(requireAuth, authorizeRoles('veterinarian', 'veterinary_staff', 'veterinary'));

// Serve a pet photo only to authenticated veterinary staff.
router.get('/pets/:petId/photo', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.petId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pet ID.'
            });
        }

        const pet = await Pet.findById(req.params.petId)
            .select('photoFilename photoContentType')
            .lean();

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found.'
            });
        }

        if (!pet.photoFilename || !pet.photoContentType) {
            return res.status(404).json({
                success: false,
                message: 'No pet photo is available.'
            });
        }

        // --- CLOUDINARY REDIRECT FIX ---
        if (pet.photoFilename.startsWith('http')) {
            return res.redirect(pet.photoFilename);
        }
        // -------------------------------

        const photoDirectory = path.join(
            __dirname,
            '../../uploads/pet-photos'
        );

        const photoPath = path.join(
            photoDirectory,
            path.basename(pet.photoFilename)
        );

        res.set('Content-Type', pet.photoContentType);
        res.set('Cache-Control', 'private, no-store');
        res.set('X-Content-Type-Options', 'nosniff');

        return res.sendFile(photoPath, (error) => {
            if (error) {
                if (!res.headersSent) {
                    return res.status(404).json({
                        success: false,
                        message: 'Pet photo file is missing from the server.'
                    });
                }
            }
        });
    } catch (error) {
        return next(error);
    }
});

// Serve an owner's profile photo to authenticated veterinary staff.
// Used by the QR scanner's owner details modal.
router.get('/owners/:ownerId/photo', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.ownerId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid owner ID.'
            });
        }

        const owner = await User.findById(req.params.ownerId)
            .select('role profilePhotoFilename profilePhotoContentType')
            .lean();

        if (!owner || owner.role !== 'owner') {
            return res.status(404).json({
                success: false,
                message: 'Owner account not found.'
            });
        }

        if (!owner.profilePhotoFilename || !owner.profilePhotoContentType) {
            return res.status(404).json({
                success: false,
                message: 'No profile photo is available.'
            });
        }

        if (owner.profilePhotoFilename.startsWith('http')) {
            return res.redirect(owner.profilePhotoFilename);
        }

        const photoDirectory = path.join(
            __dirname,
            '../../uploads/profile-photos'
        );

        const photoPath = path.join(
            photoDirectory,
            path.basename(owner.profilePhotoFilename)
        );

        res.set('Content-Type', owner.profilePhotoContentType);
        res.set('Cache-Control', 'private, no-store');
        res.set('X-Content-Type-Options', 'nosniff');

        return res.sendFile(photoPath, (error) => {
            if (error) {
                if (!res.headersSent) {
                    return res.status(404).json({
                        success: false,
                        message: 'Profile photo file is missing from the server.'
                    });
                }
            }
        });
    } catch (error) {
        return next(error);
    }
});

// Generate an official Pet ID.
// Example: PET-A1B2C3D4
function generatePetCode() {
    return `PET-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

// Veterinary area access check.
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        area: 'clinic',
        message: 'Veterinary personnel access verified.',
        user: {
            id: req.user.id,
            fullName: req.user.fullName,
            role: req.user.role
        }
    });
});


// GET /api/clinic/dashboard-overview
// Provide real database data for the clinic dashboard overview.
router.get('/dashboard-overview', async (req, res, next) => {
    try {
        // Calculate calendar boundaries using Philippine time.
        const dateParts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Manila',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).formatToParts(new Date());

        const datePart = (type) =>
            dateParts.find((part) => part.type === type).value;

        const today = new Date(
            `${datePart('year')}-${datePart('month')}-${datePart('day')}T00:00:00+08:00`
        );

        // Includes today and the next 30 calendar days.
        const dueSoonEnd = new Date(
            today.getTime() + 31 * 24 * 60 * 60 * 1000
        );

        // Only consider the latest vaccination record for each pet and
        // vaccine, so historical doses do not create duplicate alerts.
        const latestVaccinationStages = [
            {
                $sort: {
                    administeredDate: -1,
                    createdAt: -1
                }
            },
            {
                $group: {
                    _id: {
                        petId: '$petId',
                        vaccineName: {
                            $toLower: '$vaccineName'
                        }
                    },
                    record: { $first: '$$ROOT' }
                }
            },
            {
                $replaceRoot: {
                    newRoot: '$record'
                }
            }
        ];

        const overdueMatch = {
            nextDueDate: { $lt: today }
        };

        const dueSoonMatch = {
            nextDueDate: {
                $gte: today,
                $lt: dueSoonEnd
            }
        };

        const [
            registeredPets,
            pendingReview,
            overdueCount,
            dueSoonCount,
            attentionRecords,
            recentLogs
        ] = await Promise.all([
            Pet.countDocuments({}),

            Pet.countDocuments({
                registrationStatus: {
                    $in: ['pending', 'needs_verification']
                }
            }),

            VaccinationRecord.aggregate([
                ...latestVaccinationStages,
                { $match: overdueMatch },
                { $count: 'count' }
            ]),

            VaccinationRecord.aggregate([
                ...latestVaccinationStages,
                { $match: dueSoonMatch },
                { $count: 'count' }
            ]),

            VaccinationRecord.aggregate([
                ...latestVaccinationStages,
                {
                    $match: {
                        $or: [
                            overdueMatch,
                            dueSoonMatch
                        ]
                    }
                },
                { $sort: { nextDueDate: 1 } },
                { $limit: 10 }
            ]),

            AuditLog.find({})
                .sort({ createdAt: -1 })
                .limit(10)
                .lean()
        ]);

        // Audit actors are veterinary staff, resolved across collections.
        await attachActors(recentLogs, 'actorUserId');

        const attentionPetIds = [
            ...new Set(
                attentionRecords.map((record) =>
                    record.petId.toString()
                )
            )
        ];

        const attentionPets = attentionPetIds.length
            ? await Pet.find({
                _id: { $in: attentionPetIds }
            })
                .select('name petCode species registrationStatus')
                .lean()
            : [];

        const petById = new Map(
            attentionPets.map((pet) => [
                pet._id.toString(),
                pet
            ])
        );

        const vaccinationAttention = attentionRecords.map((record) => {
            const pet = petById.get(record.petId.toString());
            const overdue = record.nextDueDate < today;

            return {
                id: record._id.toString(),
                pet: pet
                    ? {
                        id: pet._id.toString(),
                        name: pet.name,
                        petCode: pet.petCode || null,
                        species: pet.species
                    }
                    : null,
                vaccineName: record.vaccineName,
                nextDueDate: record.nextDueDate,
                status: overdue ? 'overdue' : 'due_soon'
            };
        });

        const recentActivity = recentLogs.map((log) => ({
            id: log._id.toString(),
            date: log.createdAt,
            action: log.action,
            source: log.source,
            details: log.summary,
            staffName: log.actorUserId
                ? log.actorUserId.fullName
                : log.source === 'device'
                    ? 'IoT Device'
                    : log.source === 'system'
                        ? 'System'
                        : 'Unknown'
        }));

        return res.status(200).json({
            success: true,
            summary: {
                registeredPets,
                pendingReview,
                overdueVaccines: overdueCount[0]?.count || 0,
                dueSoonVaccines: dueSoonCount[0]?.count || 0
            },
            vaccinationAttention,
            recentActivity
        });
    } catch (error) {
        return next(error);
    }
});

// GET /api/clinic/reports
// Return bounded, date-filtered rows for veterinary staff to review or export.
router.get('/reports', async (req, res, next) => {
    const reportType = req.query.type;
    const allowedTypes = ['registrations', 'vaccinations', 'followups', 'inventory'];

    if (typeof reportType !== 'string' || !allowedTypes.includes(reportType)) {
        return res.status(400).json({
            success: false,
            message: 'Choose a valid report type.'
        });
    }

    function parseDate(value, label) {
        if (value === undefined) return null;
        if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new Error(`${label} must use YYYY-MM-DD format.`);
        }
        const date = new Date(`${value}T00:00:00.000Z`);
        if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
            throw new Error(`${label} must be a valid calendar date.`);
        }
        return date;
    }

    let from;
    let to;
    try {
        from = parseDate(req.query.from, 'Start date');
        to = parseDate(req.query.to, 'End date');
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }

    if (from && to && from > to) {
        return res.status(400).json({
            success: false,
            message: 'Start date must be on or before the end date.'
        });
    }

    function dateFilter(field) {
        const filter = {};
        if (from || to) {
            filter[field] = {};
            if (from) filter[field].$gte = from;
            if (to) {
                filter[field].$lt = new Date(
                    to.getTime() + 24 * 60 * 60 * 1000
                );
            }
        }
        return filter;
    }

    try {
        let columns;
        let rows;

        if (reportType === 'registrations') {
            columns = [
                'Pet ID', 'Pet name', 'Species', 'Breed', 'Owner',
                'Owner email', 'Status', 'Submitted'
            ];
            const pets = await Pet.find(dateFilter('createdAt'))
                .populate('ownerUserId', 'fullName email')
                .sort({ createdAt: -1 })
                .limit(5001)
                .lean();
            rows = pets.map((pet) => [
                pet.petCode || '',
                pet.name,
                pet.species,
                pet.breed || '',
                pet.ownerUserId?.fullName || '',
                pet.ownerUserId?.email || '',
                pet.registrationStatus,
                pet.createdAt
            ]);
        } else if (reportType === 'vaccinations' || reportType === 'followups') {
            const dateField = reportType === 'followups'
                ? 'nextDueDate'
                : 'administeredDate';
            columns = [
                'Pet ID', 'Pet name', 'Species', 'Vaccine',
                reportType === 'followups' ? 'Due date' : 'Date administered',
                'Manufacturer', 'Batch / lot', 'Dosage', 'Veterinary staff'
            ];
            const records = await VaccinationRecord.find(
                dateFilter(dateField)
            )
                .populate('petId', 'petCode name species')
                .sort({ [dateField]: reportType === 'followups' ? 1 : -1 })
                .limit(5001)
                .lean();

            await attachActors(records, 'administeredBy');
            rows = records.map((record) => [
                record.petId?.petCode || '',
                record.petId?.name || '',
                record.petId?.species || '',
                record.vaccineName,
                reportType === 'followups'
                    ? record.nextDueDate
                    : record.administeredDate,
                record.manufacturer || '',
                record.batchNumber || '',
                record.dosage || '',
                record.administeredBy?.fullName || ''
            ]);
        } else {
            columns = [
                'Vaccine', 'Manufacturer', 'Batch / lot', 'Expiry date',
                'Doses in stock', 'Low-stock threshold', 'Stock status'
            ];
            const inventory = await VaccineInventory.find({})
                .sort({ expiryDate: 1, vaccineName: 1 })
                .limit(5001)
                .lean();
            rows = inventory.map((item) => {
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);
                const status = item.expiryDate < today
                    ? 'Expired'
                    : item.stockQuantity === 0
                        ? 'Out of stock'
                        : item.stockQuantity <= item.lowStockThreshold
                            ? 'Low stock'
                            : 'In stock';
                return [
                    item.vaccineName,
                    item.manufacturer,
                    item.batchNumber,
                    item.expiryDate,
                    item.stockQuantity,
                    item.lowStockThreshold,
                    status
                ];
            });
        }

        const truncated = rows.length > 5000;
        if (truncated) rows = rows.slice(0, 5000);

        return res.status(200).json({
            success: true,
            type: reportType,
            columns,
            count: rows.length,
            rows,
            truncated,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        return next(error);
    }
});

// 1. View pending pet registrations.
router.get('/pets/pending', async (req, res, next) => {
    try {
        const pets = await Pet.find({
            registrationStatus: 'pending'
        })
            .select('ownerUserId name species breed sex dateOfBirth color photoFilename photoContentType registrationStatus createdAt')
            .populate('ownerUserId', 'fullName email')
            .sort({ createdAt: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: pets.length,
            pets: pets.map((pet) => ({
                id: pet._id.toString(),
                owner: pet.ownerUserId
                    ? {
                        id: pet.ownerUserId._id.toString(),
                        fullName: pet.ownerUserId.fullName,
                        email: pet.ownerUserId.email
                    }
                    : null,
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                sex: pet.sex,
                dateOfBirth: pet.dateOfBirth || null,
                color: pet.color,
                hasPhoto: Boolean(pet.photoFilename && pet.photoContentType),
                registrationStatus: pet.registrationStatus,
                submittedAt: pet.createdAt
            }))
        });
    } catch (error) {
        return next(error);
    }
});

// 2. Approve a pending registration and assign an official Pet ID.
router.patch(
    '/pets/:petId/approve',
    [
        body('notes')
            .optional()
            .isString()
            .withMessage('Verification notes must be text.')
            .bail()
            .trim()
            .isLength({ max: 1000 })
            .withMessage('Verification notes cannot exceed 1000 characters.')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Please correct the submitted details.',
                errors: errors.array().map((error) => ({
                    field: error.path,
                    message: error.msg
                }))
            });
        }

        if (!mongoose.isValidObjectId(req.params.petId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pet registration ID.'
            });
        }

        try {
            const pet = await Pet.findOne({
                _id: req.params.petId,
                registrationStatus: 'pending'
            });

            if (!pet) {
                return res.status(404).json({
                    success: false,
                    message: 'Pending pet registration not found. It may already have been reviewed.'
                });
            }

            // Generate a Pet ID and retry if a rare collision occurs.
            let assignedPetCode;
            let attempts = 0;

            do {
                assignedPetCode = generatePetCode();
                attempts += 1;
            } while (
                attempts < 5 &&
                await Pet.exists({ petCode: assignedPetCode })
            );

            if (await Pet.exists({ petCode: assignedPetCode })) {
                return res.status(500).json({
                    success: false,
                    message: 'Could not generate a unique Pet ID. Please try again.'
                });
            }

            // Create a unique, unpredictable QR identifier.
            const qrIdentifier = crypto.randomBytes(32).toString('hex');

            pet.petCode = assignedPetCode;
            pet.qrIdentifier = qrIdentifier;
            pet.registrationStatus = 'approved';
            pet.verifiedBy = req.user.id;
            pet.verifiedAt = new Date();

            if (req.body.notes !== undefined) {
                pet.verificationNotes = req.body.notes.trim();
            } else {
                pet.verificationNotes = '';
            }

            // Save the approved registration and its QR identifier.
            await pet.save();

            // Generate a QR image containing only the random identifier.
            const qrImage = await QRCode.toDataURL(qrIdentifier, {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                margin: 2,
                width: 300
            });

            return res.status(200).json({
                success: true,
                message: 'Pet registration approved successfully.',
                pet: {
                    id: pet._id.toString(),
                    petCode: pet.petCode,
                    name: pet.name,
                    species: pet.species,
                    registrationStatus: pet.registrationStatus,
                    verifiedAt: pet.verifiedAt,
                    qrCodeImage: qrImage
                }
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'A duplicate Pet ID was detected. Please try the approval again.'
                });
            }

            return next(error);
        }
    }
);

// 3. Mark a pending registration as needing additional verification.
router.patch(
    '/pets/:petId/needs-verification',
    [
        body('reason')
            .isString()
            .withMessage('A verification reason is required.')
            .bail()
            .trim()
            .notEmpty()
            .withMessage('A verification reason is required.')
            .bail()
            .isLength({ max: 1000 })
            .withMessage('The reason cannot exceed 1000 characters.')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid verification reason.',
                errors: errors.array().map((error) => ({
                    field: error.path,
                    message: error.msg
                }))
            });
        }

        if (!mongoose.isValidObjectId(req.params.petId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pet registration ID.'
            });
        }

        try {
            const pet = await Pet.findOneAndUpdate(
                {
                    _id: req.params.petId,
                    registrationStatus: 'pending'
                },
                {
                    $set: {
                        registrationStatus: 'needs_verification',
                        verificationNotes: req.body.reason.trim()
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            ).select('name species registrationStatus verificationNotes');

            if (!pet) {
                return res.status(404).json({
                    success: false,
                    message: 'Pending pet registration not found. It may already have been reviewed.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Pet registration marked for additional verification.',
                pet: {
                    id: pet._id.toString(),
                    name: pet.name,
                    species: pet.species,
                    registrationStatus: pet.registrationStatus,
                    verificationNotes: pet.verificationNotes
                }
            });
        } catch (error) {
            return next(error);
        }
    }
);


/**
 * GET /api/clinic/pets/qr/:identifier
 * Retrieve an approved pet using its QR identifier.
 * Access is restricted to authenticated veterinary personnel
 * by the router-level middleware above.
 */

// 4. List approved pets for vaccination recording.
router.get('/pets/approved', async (req, res, next) => {
    try {
        const pets = await Pet.find({
            registrationStatus: 'approved'
        })
            .select(
                'petCode name species breed sex ownerUserId verifiedAt'
            )
            .populate('ownerUserId', 'fullName email')
            .sort({ name: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: pets.length,
            pets: pets.map((pet) => ({
                id: pet._id.toString(),
                petCode: pet.petCode,
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                sex: pet.sex,
                owner: pet.ownerUserId
                    ? {
                        id: pet.ownerUserId._id.toString(),
                        fullName: pet.ownerUserId.fullName,
                        email: pet.ownerUserId.email
                    }
                    : null,
                verifiedAt: pet.verifiedAt || null
            }))
        });
    } catch (error) {
        return next(error);
    }
});


router.get('/pets/qr/:identifier', async (req, res, next) => {
    const identifier = req.params.identifier;

    if (!/^[a-fA-F0-9]{64}$/.test(identifier)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid QR identifier format.'
        });
    }

    try {
        const pet = await Pet.findOne({
            qrIdentifier: identifier.toLowerCase(),
            registrationStatus: 'approved'
        })
            .select(
                'petCode name species breed sex dateOfBirth color registrationStatus verifiedAt ownerUserId photoFilename photoContentType'
            )
            .populate(
                'ownerUserId',
                'fullName email phone dateOfBirth gender civilStatus nationality govId occupation address permanentAddress profilePhotoFilename profilePhotoContentType'
            )
            .lean();

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'No approved pet was found for this QR code.'
            });
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
                verifiedAt: pet.verifiedAt || null,

                // Do not expose the stored photo filename.
                hasPhoto: Boolean(
                    pet.photoFilename && pet.photoContentType
                ),

                // This endpoint remains protected by veterinary authentication.
                photoEndpoint:
                    pet.photoFilename && pet.photoContentType
                        ? `/api/clinic/pets/${pet._id.toString()}/photo`
                        : null,

                owner: pet.ownerUserId
                    ? {
                        id: pet.ownerUserId._id.toString(),
                        fullName: pet.ownerUserId.fullName,
                        email: pet.ownerUserId.email,
                        phone: pet.ownerUserId.phone || '',
                        dateOfBirth: pet.ownerUserId.dateOfBirth
                            ? new Date(pet.ownerUserId.dateOfBirth).toISOString().slice(0, 10)
                            : '',
                        gender: pet.ownerUserId.gender || '',
                        civilStatus: pet.ownerUserId.civilStatus || '',
                        nationality: pet.ownerUserId.nationality || '',
                        govId: pet.ownerUserId.govId || '',
                        occupation: pet.ownerUserId.occupation || '',
                        address: pet.ownerUserId.address || '',
                        permanentAddress: pet.ownerUserId.permanentAddress || '',
                        hasProfilePhoto: Boolean(
                            pet.ownerUserId.profilePhotoFilename && pet.ownerUserId.profilePhotoContentType
                        ),
                        photoEndpoint: pet.ownerUserId.profilePhotoFilename && pet.ownerUserId.profilePhotoContentType
                            ? `/api/clinic/owners/${pet.ownerUserId._id.toString()}/photo`
                            : null
                    }
                    : null
            }
        });
    } catch (error) {
        return next(error);
    }
});


// 5. Record a vaccination for an approved pet.
router.post(
    '/pets/:petId/vaccinations',
    [
        body('vaccineName')
            .isString()
            .withMessage('Vaccine name is required.')
            .bail()
            .trim()
            .notEmpty()
            .withMessage('Vaccine name is required.')
            .bail()
            .isLength({ min: 2, max: 150 })
            .withMessage('Vaccine name must be 2 to 150 characters.'),

        body('administeredDate')
            .isISO8601({ strict: true })
            .withMessage('Administration date must use YYYY-MM-DD format.')
            .bail()
            .custom((value) => {
                // Compare calendar dates in the clinic timezone. The browser
                // allows up to its local today, and in UTC+8 the local day is
                // already tomorrow for part of the UTC day.
                return value <= clinicDateString();
            })
            .withMessage('Administration date cannot be in the future.'),

        body('nextDueDate')
            .optional({ values: 'falsy' })
            .isISO8601({ strict: true })
            .withMessage('Next due date must use YYYY-MM-DD format.')
            .bail()
            .custom((value, { req }) => {
                return value >= req.body.administeredDate;
            })
            .withMessage(
                'Next due date cannot be earlier than the administration date.'
            ),

        body('batchNumber')
            .optional()
            .isString()
            .withMessage('Batch number must be text.')
            .bail()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Batch number cannot exceed 100 characters.'),

        body('manufacturer')
            .optional()
            .isString()
            .withMessage('Manufacturer must be text.')
            .bail()
            .trim()
            .isLength({ max: 150 })
            .withMessage('Manufacturer cannot exceed 150 characters.'),

        body('dosage')
            .optional()
            .isString()
            .withMessage('Dosage must be text.')
            .bail()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Dosage cannot exceed 100 characters.'),

        body('notes')
            .optional()
            .isString()
            .withMessage('Notes must be text.')
            .bail()
            .trim()
            .isLength({ max: 2000 })
            .withMessage('Notes cannot exceed 2000 characters.'),

        body('inventoryItemId')
            .optional({ values: 'falsy' })
            .isMongoId()
            .withMessage('Choose a valid vaccine inventory lot.'),

        body('inventoryQuantityUsed')
            .optional({ values: 'falsy' })
            .isInt({ min: 1, max: 1000 })
            .withMessage('Doses used must be a whole number from 1 to 1,000.')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Please correct the vaccination details.',
                errors: errors.array().map((error) => ({
                    field: error.path,
                    message: error.msg
                }))
            });
        }

        const { petId } = req.params;

        if (!mongoose.isValidObjectId(petId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pet ID.'
            });
        }

        try {
            const pet = await Pet.findOne({
                _id: petId,
                registrationStatus: 'approved'
            }).select('_id name petCode');

            if (!pet) {
                return res.status(404).json({
                    success: false,
                    message: 'Approved pet not found.'
                });
            }

            let inventoryItem = null;
            const inventoryQuantityUsed =
                req.body.inventoryQuantityUsed === undefined
                    ? 1
                    : Number(req.body.inventoryQuantityUsed);
            if (req.body.inventoryItemId) {
                if (
                    !Number.isInteger(inventoryQuantityUsed) ||
                    inventoryQuantityUsed < 1 ||
                    inventoryQuantityUsed > 1000
                ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Doses used must be a whole number from 1 to 1,000.'
                    });
                }

                if (!mongoose.isValidObjectId(req.body.inventoryItemId)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Choose a valid vaccine inventory lot.'
                    });
                }

                inventoryItem = await VaccineInventory.findById(
                    req.body.inventoryItemId
                ).lean();
                if (!inventoryItem) {
                    return res.status(404).json({
                        success: false,
                        message: 'Vaccine inventory lot not found.'
                    });
                }
                if (
                    inventoryItem.vaccineName.trim().toLowerCase() !==
                    req.body.vaccineName.trim().toLowerCase()
                ) {
                    return res.status(400).json({
                        success: false,
                        message: 'The selected inventory lot does not match the vaccine name.'
                    });
                }
            }

            const vaccinationData = {
                petId: pet._id,
                vaccineName: req.body.vaccineName.trim(),
                administeredDate: new Date(
                    `${req.body.administeredDate}T00:00:00.000Z`
                ),
                administeredBy: req.user.id,
                batchNumber: inventoryItem
                    ? inventoryItem.batchNumber
                    : req.body.batchNumber?.trim() || '',
                manufacturer: inventoryItem
                    ? inventoryItem.manufacturer
                    : req.body.manufacturer?.trim() || '',
                dosage: req.body.dosage?.trim() || '',
                notes: req.body.notes?.trim() || ''
            };
            if (inventoryItem) {
                vaccinationData.vaccineInventoryId = inventoryItem._id;
            }

            if (req.body.nextDueDate) {
                vaccinationData.nextDueDate = new Date(
                    `${req.body.nextDueDate}T00:00:00.000Z`
                );
            }

            const recordId = new mongoose.Types.ObjectId();
            if (inventoryItem) {
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);
                const updatedInventory = await VaccineInventory.findOneAndUpdate(
                    {
                        _id: inventoryItem._id,
                        stockQuantity: { $gte: inventoryQuantityUsed },
                        expiryDate: { $gte: today }
                    },
                    {
                        $inc: { stockQuantity: -inventoryQuantityUsed },
                        $set: { updatedBy: req.user.id },
                        $push: {
                            movements: {
                                $each: [{
                                    type: 'administered',
                                    quantityChange: -inventoryQuantityUsed,
                                    reason: `Used for ${pet.name} (${vaccinationData.vaccineName})`,
                                    actorUserId: req.user.id,
                                    vaccinationRecordId: recordId
                                }],
                                $slice: -100
                            }
                        }
                    },
                    { new: true, runValidators: true }
                );

                if (!updatedInventory) {
                    return res.status(409).json({
                        success: false,
                        message: 'The selected vaccine lot is expired or has insufficient stock. Refresh inventory and try again.'
                    });
                }
            }

            let record;
            try {
                record = await VaccinationRecord.create({
                    _id: recordId,
                    ...vaccinationData
                });
            } catch (error) {
                if (inventoryItem) {
                    await VaccineInventory.findByIdAndUpdate(
                        inventoryItem._id,
                        {
                            $inc: { stockQuantity: inventoryQuantityUsed },
                            $set: { updatedBy: req.user.id },
                            $push: {
                                movements: {
                                    $each: [{
                                        type: 'reversal',
                                        quantityChange: inventoryQuantityUsed,
                                        reason: `Reversed failed vaccination record for ${pet.name}`,
                                        actorUserId: req.user.id,
                                        vaccinationRecordId: recordId
                                    }],
                                    $slice: -100
                                }
                            }
                        }
                    );
                }
                throw error;
            }

            return res.status(201).json({
                success: true,
                message: 'Vaccination record saved successfully.',
                vaccination: {
                    id: record._id.toString(),
                    petId: record.petId.toString(),
                    vaccineName: record.vaccineName,
                    administeredDate: record.administeredDate,
                    nextDueDate: record.nextDueDate || null,
                    batchNumber: record.batchNumber,
                    manufacturer: record.manufacturer,
                    dosage: record.dosage,
                    notes: record.notes,
                    administeredBy: req.user.id,
                    createdAt: record.createdAt
                }
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'The vaccination record failed validation.'
                });
            }

            return next(error);
        }
    }
);

// 6. View the vaccination history of an approved pet.
router.get('/pets/:petId/vaccinations', async (req, res, next) => {
    const { petId } = req.params;

    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid pet ID.'
        });
    }

    try {
        const pet = await Pet.findOne({
            _id: petId,
            registrationStatus: 'approved'
        }).select('_id name petCode');

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Approved pet not found.'
            });
        }

        const records = await VaccinationRecord.find({
            petId: pet._id
        })
            .sort({ administeredDate: -1, createdAt: -1 })
            .lean();

        await attachActors(records, 'administeredBy');

        return res.status(200).json({
            success: true,
            pet: {
                id: pet._id.toString(),
                petCode: pet.petCode,
                name: pet.name
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
                administeredBy: record.administeredBy
                    ? record.administeredBy.fullName
                    : 'Unknown',
                createdAt: record.createdAt
            }))
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;