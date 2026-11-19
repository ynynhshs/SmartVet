const mongoose = require('mongoose');

const inventoryMovementSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['received', 'adjustment', 'administered', 'reversal'],
            required: true
        },
        quantityChange: {
            type: Number,
            required: true,
            validate: Number.isInteger
        },
        reason: {
            type: String,
            trim: true,
            maxlength: 250,
            default: ''
        },
        actorUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        vaccinationRecordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'VaccinationRecord',
            default: undefined
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const vaccineInventorySchema = new mongoose.Schema(
    {
        vaccineName: {
            type: String,
            required: [true, 'Vaccine name is required.'],
            trim: true,
            minlength: 2,
            maxlength: 150
        },
        manufacturer: {
            type: String,
            required: [true, 'Manufacturer is required.'],
            trim: true,
            maxlength: 150
        },
        batchNumber: {
            type: String,
            required: [true, 'Batch or lot number is required.'],
            trim: true,
            maxlength: 100
        },
        expiryDate: {
            type: Date,
            required: [true, 'Expiry date is required.']
        },
        stockQuantity: {
            type: Number,
            required: true,
            min: 0,
            validate: Number.isInteger
        },
        lowStockThreshold: {
            type: Number,
            default: 5,
            min: 0,
            validate: Number.isInteger
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ''
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        movements: {
            type: [inventoryMovementSchema],
            default: []
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

vaccineInventorySchema.index({ expiryDate: 1, vaccineName: 1 });
vaccineInventorySchema.index({ vaccineName: 1, batchNumber: 1 });

module.exports = mongoose.model('VaccineInventory', vaccineInventorySchema);
