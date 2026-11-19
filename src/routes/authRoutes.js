const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

const User = require('../models/User');
const { hashPassword, comparePassword, createAccessToken } = require('../services/authService');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Cloudinary for Registration Profile Photos
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const registerPhotoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'smartvet/profiles',
        allowed_formats: ['jpg', 'png', 'webp']
    }
});

const registerPhotoUpload = multer({
    storage: registerPhotoStorage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
            return callback(new Error('Profile photo must be a JPG, PNG, or WebP image.'));
        }
        callback(null, true);
    }
});

// Turns multer failures (wrong file type, oversized photo) into a readable 400
// instead of letting them fall through to the 500 handler.
function handleRegisterPhoto(req, res, next) {
    registerPhotoUpload.single('profilePhoto')(req, res, (error) => {
        if (!error) {
            return next();
        }

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Profile photo must be 5 MB or smaller.'
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message || 'Unable to upload the profile photo.'
        });
    });
}

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false,
    message: { success: false, message: 'Too many registration attempts. Please try again later.' }
});

// POST /api/auth/register
router.post(
    '/register',
    registerLimiter,
    handleRegisterPhoto, // Handle file upload
    [
        body('fullName').isString().trim().isLength({ min: 2, max: 120 })
            .withMessage('Please enter your full name (2–120 characters).'),
        body('email').isString().trim().isEmail().withMessage('Please enter a valid email address.').isLength({ max: 254 }),
        body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
            .custom((p) => Buffer.byteLength(p, 'utf8') <= 72)
            .withMessage('Password must be 72 bytes or fewer.'),
        body('phone').optional({ checkFalsy: true }).isString().trim().isLength({ max: 30 })
            .withMessage('Mobile number must be 30 characters or fewer.'),
        body('dateOfBirth').optional({ checkFalsy: true }).isISO8601().withMessage('Please enter a valid date of birth.').toDate(),
        body('gender').optional({ checkFalsy: true }).isString(),
        body('civilStatus').optional({ checkFalsy: true }).isString(),
        body('nationality').optional({ checkFalsy: true }).isString().trim().isLength({ max: 100 })
            .withMessage('Nationality must be 100 characters or fewer.'),
        body('govId').optional({ checkFalsy: true }).isString().trim().isLength({ max: 100 })
            .withMessage('Government ID must be 100 characters or fewer.'),
        body('occupation').optional({ checkFalsy: true }).isString(),
        body('address').optional({ checkFalsy: true }).isString().trim().isLength({ max: 250 })
            .withMessage('Address must be 250 characters or fewer.'),
        body('permanentAddress').optional({ checkFalsy: true }).isString().trim().isLength({ max: 250 })
            .withMessage('Permanent address must be 250 characters or fewer.')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        const email = req.body.email.trim().toLowerCase();
        
        try {
            const existingUser = await User.findOne({ email }).lean();
            if (existingUser) {
                return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
            }

            const passwordHash = await hashPassword(req.body.password);

            const userData = {
                fullName: req.body.fullName.trim(),
                email: email,
                passwordHash,
                role: 'owner',
                status: 'active',
                phone: req.body.phone || '',
                dateOfBirth: req.body.dateOfBirth || null,
                gender: req.body.gender || '',
                civilStatus: req.body.civilStatus || '',
                nationality: req.body.nationality || '',
                govId: req.body.govId || '',
                occupation: req.body.occupation || '',
                address: req.body.address || '',
                permanentAddress: req.body.permanentAddress || ''
            };

            // Attach photo data if uploaded
            if (req.file) {
                userData.profilePhotoFilename = req.file.path; 
                userData.profilePhotoContentType = req.file.mimetype;
                userData.profilePhotoOriginalName = path.basename(req.file.originalname).slice(0, 255);
                userData.profilePhotoSize = req.file.size;
            }

            const user = await User.create(userData);
            const accessToken = createAccessToken(user);

            user.lastLoginAt = new Date();
            await user.save();

            return res.status(201).json({
                success: true,
                message: 'Owner account registered successfully.',
                tokenType: 'Bearer',
                accessToken,
                expiresIn: process.env.JWT_EXPIRES_IN || '1h',
                user: {
                    id: user._id.toString(),
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            if (error && error.code === 11000) {
                return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
            }
            return next(error);
        }
    }
);

// POST /api/auth/login
router.post(
    '/login',
    loginLimiter,
    [
        body('email').isString().trim().isEmail(),
        body('password').isString().notEmpty().custom((p) => Buffer.byteLength(p, 'utf8') <= 72)
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email and password.' });
        }

        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password;

        try {
            const user = await User.findOne({ email }).select('+passwordHash');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid email or password.' });
            }

            const passwordIsValid = await comparePassword(password, user.passwordHash);
            if (!passwordIsValid || user.status !== 'active') {
                return res.status(401).json({ success: false, message: 'Invalid email or password.' });
            }

            const accessToken = createAccessToken(user);
            user.lastLoginAt = new Date();
            await user.save();

            return res.status(200).json({
                success: true,
                message: 'Login successful.',
                tokenType: 'Bearer',
                accessToken,
                expiresIn: process.env.JWT_EXPIRES_IN || '1h',
                user: { id: user._id.toString(), fullName: user.fullName, email: user.email, role: user.role }
            });
        } catch (error) {
            return next(error);
        }
    }
);

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
    return res.status(200).json({ success: true, user: req.user, tokenExpiresAt: req.auth.expiresAt });
});

module.exports = router;