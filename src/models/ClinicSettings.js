const mongoose = require('mongoose');

// Single-document collection holding the clinic's global settings.
// The veterinary administrator is the only role that can change these.
const clinicSettingsSchema = new mongoose.Schema(
    {
        // Singleton guard. There is exactly one settings document.
        key: {
            type: String,
            unique: true,
            default: 'global',
            immutable: true
        },

        clinicName: { type: String, trim: true, default: 'VetCare', maxlength: 120 },
        clinicEmail: { type: String, trim: true, default: '', maxlength: 254 },
        clinicPhone: { type: String, trim: true, default: '', maxlength: 30 },
        clinicAddress: { type: String, trim: true, default: '', maxlength: 250 },

        // Registration workflow.
        requirePetVerification: { type: Boolean, default: true },

        // Owner self-service switches.
        allowOwnerRegistration: { type: Boolean, default: true },
        allowOwnerPinUnlock: { type: Boolean, default: true },

        // Vaccination reminders.
        reminderEnabled: { type: Boolean, default: true },
        reminderDaysBefore: {
            type: Number,
            min: 0,
            max: 60,
            default: 7
        },

        // IoT device ingest.
        deviceTelemetryEnabled: { type: Boolean, default: true },

        // Sign-in security.
        maxLoginAttempts: {
            type: Number,
            min: 3,
            max: 20,
            default: 10
        },
        sessionTimeoutMinutes: {
            type: Number,
            min: 15,
            max: 1440,
            default: 60
        },

        // Last administrator who saved the settings.
        // // The id belongs to the `VeterinaryUser` collection; resolve it with
        // `attachActors` from `src/services/actorService.js`, because a Mongoose
        // `ref` can only name one collection.
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            default: undefined
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Return the current settings, creating the singleton document on first use.
clinicSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne({ key: 'global' }).lean();

    if (!settings) {
        settings = await this.create({ key: 'global' });
        settings = settings.toObject ? settings.toObject() : settings;
    }

    return settings;
};

// Apply a partial update to the singleton document.
clinicSettingsSchema.statics.updateSettings = async function (changes) {
    const settings = await this.findOneAndUpdate(
        { key: 'global' },
        { $set: changes },
        { returnDocument: 'after', upsert: true, runValidators: true }
    );

    return settings;
};

const ClinicSettings = mongoose.model(
    'ClinicSettings',
    clinicSettingsSchema
);

module.exports = ClinicSettings;
