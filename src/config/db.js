
const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas using MONGODB_URI. Throws when the connection
 * string is missing and logs the connected database name on success.
 */
async function connectDB() {
    const uri = process.env.MONGODB_URI;

    // Stop if the connection string is missing.
    if (!uri) {
        throw new Error(
            'MONGODB_URI is missing from the .env configuration.'
        );
    }

    // Connect to MongoDB Atlas.
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000
    });

    console.log('MongoDB connected successfully.');
    console.log(`Database: ${mongoose.connection.name}`);
}

module.exports = connectDB;
