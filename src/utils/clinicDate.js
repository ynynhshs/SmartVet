// Calendar-date helpers for clinic records.
//
// The clinic operates in Philippine local time (the vaccination reminder cron
// already uses Asia/Manila). Dates typed into the UI are calendar dates, so
// "today" must be resolved in that zone. Comparing them against the UTC day
// breaks once the local day rolls over, which happens 8 hours before the UTC
// day: a vaccination recorded on the current local date is then rejected as a
// future date.
const CLINIC_TIMEZONE = process.env.CLINIC_TIMEZONE || 'Asia/Manila';

// Returns a `YYYY-MM-DD` string for the given instant in the clinic timezone.
/**
 * Format an instant as a `YYYY-MM-DD` calendar date in the clinic timezone
 * (Asia/Manila by default). Used so date comparisons follow local clinic days
 * rather than the UTC day.
 */
function clinicDateString(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: CLINIC_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(date);

    const values = {};

    parts.forEach((part) => {
        if (part.type !== 'literal') {
            values[part.type] = part.value;
        }
    });

    return `${values.year}-${values.month}-${values.day}`;
}

module.exports = {
    CLINIC_TIMEZONE,
    clinicDateString
};
