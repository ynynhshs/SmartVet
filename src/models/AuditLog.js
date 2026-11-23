
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
    {
        // Staff member who performed the action.
        // Can be empty for device-generated events.
        //
        // The id belongs to the `VeterinaryUser` collection. Resolve it with
        // `attachActors` from `src/services/actorService.js` rather than
        // `populate`, because a `ref` can only name one collection.
        actorUserId: {
            type: mongoose.Schema.Types.ObjectId,
            default: undefined,
            index: true
        },

        // Origin of the action.
        source: {
            type: String,
            enum: ['user', 'system', 'device'],
            required: true,
            default: 'user'
        },

        // Action performed, for example PET_APPROVED.
        action: {
            type: String,
            required: [true, 'Audit action is required.'],
            trim: true,
            uppercase: true,
            maxlength: 100
        },

        // Type of record affected by the action.
        entityType: {
            type: String,
            enum: [
                'user',
                'pet',
                'vaccination_record',
                'feeding_schedule',
                'feeding_event',
                'activity_record',
                'device',
                'notification',
                'system',
                'none'
            ],
            required: [true, 'Affected record type is required.']
        },

        // Identifier of the affected record, when applicable.
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            default: undefined
        },

        // Short, human-readable explanation of the action.
        summary: {
            type: String,
            required: [true, 'Audit summary is required.'],
            trim: true,
            maxlength: 1000
        },

        // Optional request identifier for troubleshooting.
        requestId: {
            type: String,
            trim: true,
            maxlength: 150,
            default: ''
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Retrieve audit history for a particular user.
auditLogSchema.index({
    actorUserId: 1,
    createdAt: -1
});

// Retrieve the history of actions affecting a record.
auditLogSchema.index({
    entityType: 1,
    entityId: 1,
    createdAt: -1
});

// Retrieve the newest audit entries first.
auditLogSchema.index({
    createdAt: -1
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
