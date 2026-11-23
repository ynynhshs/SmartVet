// Verifies that sign-in accounts are split across two collections:
// pet owners in `users` and veterinary staff in `veterinaryusers`.
//
// Run with: node --test tests/user-collection-split.test.js
// The database-backed checks need MONGODB_URI and create then delete
// temporary accounts.

require('dotenv').config({ quiet: true });

const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const User = require('../src/models/User');
const VeterinaryUser = require('../src/models/VeterinaryUser');
const {
    resolveActors,
    attachActors
} = require('../src/services/actorService');

let passed = 0;
let failed = 0;

/**
 * Records one assertion result, appending diagnostic detail to the FAIL line
 * when the condition is false.
 */
function check(label, condition, detail) {
    if (condition) {
        passed++;
        console.log(`PASS: ${label}`);
        return;
    }

    failed++;
    console.error(`FAIL: ${label}${detail ? ` - ${detail}` : ''}`);
}

/**
 * Returns the Mongoose validation error for the role field when Model is given
 * that role, or null when the role is accepted.
 */
function roleError(Model, role) {
    const error = new Model({
        fullName: 'Role Check',
        email: `role.check.${role}@smartvet.local`,
        passwordHash: 'test-hash-only',
        role
    }).validateSync({ suppressDeprecationWarning: true });

    return error && error.errors ? error.errors.role : null;
}

const validOwner = {
    fullName: 'Owner Check',
    email: 'owner.check@smartvet.local',
    passwordHash: 'test-hash-only',
    role: 'owner'
};

const validStaff = {
    fullName: 'Staff Check',
    email: 'staff.check@smartvet.local',
    passwordHash: 'test-hash-only',
    role: 'veterinary_staff'
};

/**
 * Runs the schema and live-database checks proving owners stay in `users` while
 * veterinary staff stay in `veterinaryusers`, including actor resolution.
 */
async function main() {
    // --- schema-level separation -------------------------------------------
    check(
        'User accepts the owner role',
        !roleError(User, 'owner')
    );

    check(
        'User rejects the legacy veterinary role',
        Boolean(roleError(User, 'veterinary'))
    );

    check(
        'User rejects the legacy admin role',
        Boolean(roleError(User, 'admin'))
    );

    check(
        'VeterinaryUser accepts the veterinarian role',
        !roleError(VeterinaryUser, 'veterinarian')
    );

    check(
        'VeterinaryUser accepts the veterinary_staff role',
        !roleError(VeterinaryUser, 'veterinary_staff')
    );

    check(
        'VeterinaryUser rejects the owner role',
        Boolean(roleError(VeterinaryUser, 'owner'))
    );

    const validOwnerError = new User(validOwner).validateSync();
    check('a valid owner document passes validation', !validOwnerError);

    const validStaffError = new VeterinaryUser(validStaff).validateSync();
    check('a valid staff document passes validation', !validStaffError);

    // --- actor resolution across both collections --------------------------
    const databaseUrl = process.env.MONGODB_URI;

    if (!databaseUrl) {
        console.log('\nMONGODB_URI is not set - skipping the database checks.');
        console.log(`\nPassed: ${passed}, failed: ${failed}`);
        process.exitCode = failed ? 1 : 0;
        return;
    }

    await mongoose.connect(databaseUrl);

    const owner = await User.create({
        ...validOwner,
        email: `split.owner.${Date.now()}@smartvet.local`
    });

    const staff = await VeterinaryUser.create({
        fullName: 'Split Staff',
        email: `split.staff.${Date.now()}@smartvet.local`,
        passwordHash: 'test-hash-only',
        role: 'veterinary_staff'
    });

    const actors = await resolveActors([owner._id, staff._id]);

    check(
        'resolveActors finds the owner account',
        actors.get(String(owner._id)) &&
            actors.get(String(owner._id)).source === 'owner'
    );

    check(
        'resolveActors finds the staff account',
        actors.get(String(staff._id)) &&
            actors.get(String(staff._id)).source === 'veterinary'
    );

    check(
        'resolveActors carries the full name',
        actors.get(String(staff._id)).fullName === 'Split Staff'
    );

    const documents = [
        { actorUserId: owner._id },
        { actorUserId: staff._id },
        { actorUserId: new mongoose.Types.ObjectId() },
        { actorUserId: 'not-an-object-id' }
    ];

    await attachActors(documents, 'actorUserId');

    check(
        'attachActors resolves an owner id',
        documents[0].actorUserId.fullName === 'Owner Check' &&
            documents[0].actorUserId.source === 'owner'
    );

    check(
        'attachActors resolves a staff id',
        documents[1].actorUserId.fullName === 'Split Staff' &&
            documents[1].actorUserId.source === 'veterinary'
    );

    check(
        'attachActors keeps an _id property for existing consumers',
        Boolean(documents[1].actorUserId._id)
    );

    check(
        'attachActors nulls an unknown actor id',
        documents[2].actorUserId === null
    );

    check(
        'attachActors tolerates a malformed actor id',
        documents[3].actorUserId === null
    );

    check(
        'attachActors leaves an empty list untouched',
        (await attachActors([], 'actorUserId')).length === 0
    );

    // --- the live collections stay separated -------------------------------
    const staffRolesInUsers = await User.countDocuments({
        role: { $in: ['veterinary', 'admin', 'veterinarian', 'veterinary_staff'] }
    });

    check(
        'no staff account remains in the users collection',
        staffRolesInUsers === 0,
        `${staffRolesInUsers} found`
    );

    const ownerRoles = await User.distinct('role');
    check(
        'every users document has the owner role',
        ownerRoles.length === 1 && ownerRoles[0] === 'owner',
        JSON.stringify(ownerRoles)
    );

    await User.deleteOne({ _id: owner._id });
    await VeterinaryUser.deleteOne({ _id: staff._id });

    await mongoose.disconnect();

    console.log(`\nPassed: ${passed}, failed: ${failed}`);
    process.exitCode = failed ? 1 : 0;
}

// Logs the unexpected failure, marks the run as failed, and closes the connection.
main().catch((error) => {
    console.error(`\nSplit test failed: ${error.message}`);
    process.exitCode = 1;
    mongoose.disconnect().catch(() => {});
});
