const mongoose = require('mongoose');
const { hashPassword } = require('../services/authService');

// Veterinary staff account created by the veterinary administrator.
//
// This collection is deliberately separate from the owner `User` collection:
// owners self-register through /login.html and sign in there, while veterinary
// accounts are provisioned by the administrator from the clinic workspace and
// sign in at /clinic/login.html. Keeping them apart means an owner can never be
// promoted to clinic staff by editing a flag, and a disabled staff account can
// never fall back to owner access.
const veterinaryUserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required.'],
            trim: true,
            minlength: 2,
            maxlength: 120
        },

        email: {
            type: String,
            required: [true, 'Email address is required.'],
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254
        },

        passwordHash: {
            type: String,
            required: [true, 'Password hash is required.'],
            select: false
        },

        role: {
            type: String,
            enum: ['veterinarian', 'veterinary_staff'],
            default: 'veterinary_staff',
            required: true
        },

        // --- PERSONAL INFORMATION ---
        dateOfBirth: { type: Date, default: null },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Prefer not to say', ''],
            default: ''
        },
        civilStatus: {
            type: String,
            enum: ['Single', 'Married', 'Widowed', 'Separated', ''],
            default: ''
        },
        nationality: { type: String, trim: true, default: '', maxlength: 100 },
        govId: { type: String, trim: true, default: '', maxlength: 100 },
        occupation: {
            type: String,
            enum: ['Employed', 'Self-Employed', 'Student', ''],
            default: ''
        },

        // --- CONTACT & ADDRESS ---
        phone: { type: String, trim: true, default: '', maxlength: 30 },
        address: { type: String, trim: true, default: '', maxlength: 250 },
        permanentAddress: {
            type: String,
            trim: true,
            default: '',
            maxlength: 250
        },

        // --- EMPLOYMENT ---
        licenseNumber: {
            type: String,
            trim: true,
            default: '',
            maxlength: 100
        },
        position: { type: String, trim: true, default: '', maxlength: 120 },

        // --- ACCESS CONTROL ---
        status: {
            type: String,
            enum: ['active', 'disabled'],
            default: 'active',
            required: true
        },

        // Forces a password change at the next clinic sign-in.
        mustChangePassword: {
            type: Boolean,
            default: false
        },

        lastLoginAt: { type: Date, default: null },

        // Administrator who provisioned or last updated this account. Both
        // ids belong to this same collection; resolve them with
        // `attachActors` rather than `populate`.
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            default: undefined
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            default: undefined
        }
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            // Strip the password hash from serialized staff accounts.
            transform: (doc, ret) => {
                delete ret.passwordHash;
                return ret;
            }
        }
    }
);

// Look up a staff account by email, always including the password hash so the
// clinic sign-in can verify it.
/**
 * Find a staff account by case-normalized email, always including the otherwise
 * excluded `passwordHash` so sign-in can verify it.
 */
veterinaryUserSchema.statics.findByEmailWithPassword = function (email) {
    return this.findOne({
        email: String(email || '').trim().toLowerCase()
    }).select('+passwordHash');
};

// Create a staff account with a hashed password.
/**
 * Create a VeterinaryUser with a bcrypt-hashed password and default empty values
 * for optional profile fields.
 */
veterinaryUserSchema.statics.createAccount = async function (data) {
    const passwordHash = await hashPassword(data.password);

    return this.create({
        fullName: data.fullName,
        email: data.email,
        passwordHash,
        role: data.role,
        dateOfBirth: data.dateOfBirth || null,
        gender: data.gender || '',
        civilStatus: data.civilStatus || '',
        nationality: data.nationality || '',
        govId: data.govId || '',
        occupation: data.occupation || '',
        phone: data.phone || '',
        address: data.address || '',
        permanentAddress: data.permanentAddress || '',
        licenseNumber: data.licenseNumber || '',
        position: data.position || '',
        status: data.status || 'active',
        mustChangePassword: Boolean(data.mustChangePassword),
        createdBy: data.createdBy || undefined
    });
};

const VeterinaryUser = mongoose.model(
    'VeterinaryUser',
    veterinaryUserSchema
);

module.exports = VeterinaryUser;
