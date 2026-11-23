const mongoose = require('mongoose');

const User = require('../models/User');
const VeterinaryUser = require('../models/VeterinaryUser');

// Sign-in accounts live in two collections: pet owners (`User`) and veterinary
// staff (`VeterinaryUser`). Several records store the id of whoever performed an
// action (a vaccination, a device registration, an audit entry) without saying
// which collection that id belongs to, so a Mongoose `populate` cannot resolve
// them -- `ref` can only name one model.
//
// These helpers resolve actor ids against both collections instead.

function toObjectId(id) {
    if (id === null || id === undefined || id === '') {
        return null;
    }

    if (id instanceof mongoose.Types.ObjectId) {
        return id;
    }

    const value = String(id);

    if (!mongoose.Types.ObjectId.isValid(value)) {
        return null;
    }

    return new mongoose.Types.ObjectId(value);
}

// Build a map of actor id -> { id, fullName, source, role }.
// Unknown or malformed ids are simply absent from the map.
async function resolveActors(ids) {
    const objectIds = [
        ...new Set(
            ids
                .map(toObjectId)
                .filter(Boolean)
                .map((id) => id.toString())
        )
    ].map((value) => new mongoose.Types.ObjectId(value));

    const actors = new Map();

    if (!objectIds.length) {
        return actors;
    }

    const [owners, staff] = await Promise.all([
        User.find({ _id: { $in: objectIds } })
            .select('fullName role')
            .lean(),
        VeterinaryUser.find({ _id: { $in: objectIds } })
            .select('fullName role')
            .lean()
    ]);

    owners.forEach((owner) => {
        actors.set(String(owner._id), {
            _id: String(owner._id),
            id: String(owner._id),
            fullName: owner.fullName,
            role: owner.role,
            source: 'owner'
        });
    });

    staff.forEach((account) => {
        actors.set(String(account._id), {
            _id: String(account._id),
            id: String(account._id),
            fullName: account.fullName,
            role: account.role,
            source: 'veterinary'
        });
    });

    return actors;
}

// Replace `document[field]` (an actor id) with the resolved actor summary.
// Mirrors the shape a `.populate(field, 'fullName')` used to produce, so
// existing response mapping keeps working, and adds `source` so a caller can
// tell an owner from a staff member.
//
// Documents must be plain objects (use `.lean()`); assigning to a Mongoose
// document path would attempt an ObjectId cast.
async function attachActors(documents, field) {
    if (!Array.isArray(documents) || !documents.length) {
        return documents;
    }

    const actors = await resolveActors(
        documents.map((document) => document[field])
    );

    documents.forEach((document) => {
        const key = toObjectId(document[field]);
        document[field] = key && actors.has(key.toString())
            ? actors.get(key.toString())
            : null;
    });

    return documents;
}

module.exports = {
    resolveActors,
    attachActors
};
