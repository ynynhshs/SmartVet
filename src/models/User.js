const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: [true, 'Full name is required.'], trim: true, minlength: 2, maxlength: 120 },
        email: { type: String, required: [true, 'Email address is required.'], unique: true, lowercase: true, trim: true, maxlength: 254 },
        passwordHash: { type: String, required: [true, 'Password hash is required.'], select: false },
        role: { type: String, enum: ['admin', 'veterinary', 'owner'], default: 'owner', required: true },
        
        // --- NEW PERSONAL DETAILS ---
        dateOfBirth: { type: Date, default: null },
        gender: { type: String, enum: ['Male', 'Female', 'Prefer not to say', ''], default: '' },
        civilStatus: { type: String, enum: ['Single', 'Married', 'Widowed', 'Separated', ''], default: '' },
        nationality: { type: String, trim: true, default: '' },
        govId: { type: String, trim: true, default: '' },
        occupation: { type: String, enum: ['Employed', 'Self-Employed', 'Student', ''], default: '' },
        
        // --- CONTACT & ADDRESS ---
        phone: { type: String, trim: true, maxlength: 30, default: '' },
        address: { type: String, trim: true, maxlength: 250, default: '' }, // Current Address
        permanentAddress: { type: String, trim: true, maxlength: 250, default: '' },
        
        // --- PROFILE PHOTO (CLOUDINARY) ---
        profilePhotoFilename: { type: String, default: '', maxlength: 500 },
        profilePhotoContentType: { type: String, enum: ['', 'image/jpeg', 'image/png', 'image/webp'], default: '' },
        profilePhotoOriginalName: { type: String, default: '', maxlength: 255 },
        profilePhotoSize: { type: Number, default: 0, min: 0 },

        status: { type: String, enum: ['active', 'disabled'], default: 'active', required: true },
        lastLoginAt: { type: Date, default: null }
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { transform: (doc, ret) => { delete ret.passwordHash; return ret; } }
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;