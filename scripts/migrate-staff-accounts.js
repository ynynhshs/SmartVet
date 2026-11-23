// Move veterinary staff accounts out of the shared `users` collection into the
// dedicated `veterinaryusers` collection.
//
// Background: `users` used to hold pet owners and clinic staff together,
// separated only by a `role` flag. Staff accounts now live in `VeterinaryUser`
// and sign in at /clinic/login.html, while `users` holds pet owners only.
//
// Account ids are preserved, so existing references (vaccination records,
// devices, audit entries) keep pointing at the same account.
//
// Usage:
//   node scripts/migrate-staff-accounts.js            # apply
//   node scripts/migrate-staff-accounts.js --dry-run  # report only
//
// A full backup of both collections is written to scripts/backups/ before any
// change. The backup contains password hashes: treat it as sensitive and
// delete it once the migration is confirmed.

require('dotenv').config({ quiet: true });

const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');

const DRY_RUN = process.argv.includes('--dry-run');

// Legacy `users.role` value -> `veterinaryusers.role` value.
const ROLE_MAP = {
    veterinary: 'veterinary_staff',
    admin: 'veterinarian'
};

const COPIED_FIELDS = [
    'fullName',
    'email',
    'passwordHash',
    'dateOfBirth',
    'gender',
    'civilStatus',
    'nationality',
    'govId',
    'occupation',
    'phone',
    'address',
    'permanentAddress',
    'status',
    'lastLoginAt',
    'createdAt',
    'updatedAt'
];

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const staffAccounts = await db.collection('users')
        .find({ role: { $in: Object.keys(ROLE_MAP) } })
        .toArray();

    console.log(`Staff accounts found in users: ${staffAccounts.length}`);

    staffAccounts.forEach((account) => {
        console.log(
            `  ${account.email} (role: ${account.role} -> ${ROLE_MAP[account.role]})`
        );
    });

    const existingStaff = await db.collection('veterinaryusers')
        .find({})
        .project({ email: 1 })
        .toArray();
    const staffEmails = new Set(existingStaff.map((doc) => doc.email));

    if (!DRY_RUN && staffAccounts.length) {
        const backupDir = path.join(__dirname, 'backups');
        fs.mkdirSync(backupDir, { recursive: true });

        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `${stamp}-pre-staff-split.json`);

        const backup = {
            createdAt: new Date(),
            reason: 'staff accounts moved from users to veterinaryusers',
            users: await db.collection('users').find({}).toArray(),
            veterinaryusers: await db.collection('veterinaryusers')
                .find({})
                .toArray()
        };

        fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
        console.log(`\nBackup written: ${backupPath}`);
    }

    let moved = 0;
    let skipped = 0;

    for (const account of staffAccounts) {
        if (staffEmails.has(account.email)) {
            console.log(
                `Skipping ${account.email}: already present in veterinaryusers.`
            );
            skipped += 1;
            continue;
        }

        const document = { _id: account._id };

        COPIED_FIELDS.forEach((field) => {
            if (account[field] !== undefined) {
                document[field] = account[field];
            }
        });

        document.role = ROLE_MAP[account.role];

        if (DRY_RUN) {
            console.log(`Would move ${account.email} as ${document.role}.`);
            moved += 1;
            continue;
        }

        await db.collection('veterinaryusers').insertOne(document);
        await db.collection('users').deleteOne({ _id: account._id });
        staffEmails.add(account.email);

        console.log(
            `Moved ${account.email} (role: ${account.role} -> ${document.role}).`
        );
        moved += 1;
    }

    const remaining = await db.collection('users')
        .countDocuments({ role: { $in: Object.keys(ROLE_MAP) } });
    const byRole = await db.collection('users').aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
    ]).toArray();

    console.log(`\nMoved: ${moved}, skipped: ${skipped}`);
    console.log(`Staff-role accounts still in users: ${remaining}`);
    console.log(`users by role: ${JSON.stringify(byRole)}`);
    console.log(
        `veterinaryusers total: ${await db.collection('veterinaryusers').countDocuments({})}`
    );

    if (DRY_RUN) {
        console.log('\nDry run only - no changes were written.');
    }

    await mongoose.disconnect();
}

main().catch((error) => {
    console.error(`\nMigration failed: ${error.message}`);
    process.exitCode = 1;
    mongoose.disconnect().catch(() => {});
});
