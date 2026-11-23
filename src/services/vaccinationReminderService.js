
const Pet = require('../models/Pet');
const User = require('../models/User');
const VaccinationRecord = require('../models/VaccinationRecord');
const Notification = require('../models/Notification');
const { sendPushToUser } = require('./pushService');

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const REMINDER_WINDOW_DAYS = 7;

/**
 * Truncate a date to midnight UTC of its own calendar day, returning null for
 * invalid input. Used to compare due dates by calendar day.
 */
function toUtcDateOnly(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        )
    );
}

/**
 * Format a Date as a `YYYY-MM-DD` string via its UTC ISO representation.
 */
function formatDateOnly(value) {
    return value.toISOString().slice(0, 10);
}

/**
 * Scan vaccination records and create in-app notifications (plus browser push)
 * for pets that are overdue or due within 7 days. Only approved pets with an
 * owner are eligible, and a `dedupeKey` unique index suppresses repeat
 * notifications. Returns counts for scanned, eligible, created, duplicates,
 * skipped and pushed.
 */
async function generateVaccinationReminders() {
    const now = new Date();
    const today = toUtcDateOnly(now);
    const windowEnd = new Date(
        today.getTime() + REMINDER_WINDOW_DAYS * DAY_IN_MS
    );

    const records = await VaccinationRecord.find({
        nextDueDate: { $type: 'date' }
    })
        .select('petId vaccineName nextDueDate')
        .populate({
            path: 'petId',
            select: 'name petCode ownerUserId registrationStatus',
            populate: {
                path: 'ownerUserId',
                select: 'fullName email'
            }
        })
        .lean();

    let eligible = 0;
    let created = 0;
    let duplicates = 0;
    let skipped = 0;
    let pushed = 0;

    for (const record of records) {
        const pet = record.petId;

        // Only create reminders for approved pets with an owner.
        if (
            !pet ||
            pet.registrationStatus !== 'approved' ||
            !pet.ownerUserId
        ) {
            skipped += 1;
            continue;
        }

        const dueDate = toUtcDateOnly(record.nextDueDate);

        if (!dueDate) {
            skipped += 1;
            continue;
        }

        let type;
        let title;
        let priority;
        let message;

        const dueDateText = formatDateOnly(dueDate);

        if (dueDate.getTime() < today.getTime()) {
            type = 'vaccination_overdue';
            title = 'Vaccination Overdue';
            priority = 'high';
            message =
                `${pet.name}'s ${record.vaccineName} vaccination was due ` +
                `on ${dueDateText}. Please contact your veterinary clinic ` +
                'to confirm the next steps.';
        } else if (dueDate.getTime() <= windowEnd.getTime()) {
            type = 'vaccination_due';
            title = 'Vaccination Due Soon';
            priority = 'normal';
            message =
                `${pet.name}'s ${record.vaccineName} vaccination is due ` +
                `on ${dueDateText}. Please contact your veterinary clinic ` +
                'to confirm the schedule.';
        } else {
            skipped += 1;
            continue;
        }

        const owner = pet.ownerUserId;
        const ownerUserId = owner._id || owner;

        // The same record, due date, and notification type should
        // generate at most one notification for the same owner.
        const dedupeKey =
            `${type}:${record._id.toString()}:${dueDateText}`;

        eligible += 1;

        try {
            await Notification.create({
                userId: ownerUserId,
                petId: pet._id,
                type,
                title,
                message,
                relatedRecordType: 'vaccination_record',
                relatedRecordId: record._id,
                dedupeKey,
                priority,
                readAt: null
            });

            created += 1;

            // Also deliver a browser push notification. A push failure must
            // never block the in-app notification that was just saved.
            try {
                const pushResult = await sendPushToUser(ownerUserId, {
                    title,
                    message
                });

                if (pushResult.sent > 0) {
                    pushed += 1;
                }
            } catch (pushError) {
                console.error(
                    '[Vaccination reminders] push delivery failed:',
                    pushError.message
                );
            }
        } catch (error) {
            if (error.code === 11000) {
                duplicates += 1;
                continue;
            }

            throw error;
        }
    }

    return {
        scanned: records.length,
        eligible,
        created,
        duplicates,
        skipped,
        pushed
    };
}

module.exports = {
    generateVaccinationReminders
};
