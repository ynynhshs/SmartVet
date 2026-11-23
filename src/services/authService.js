
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BCRYPT_ROUNDS = 12;
const JWT_ISSUER = 'smartvet-api';
const JWT_AUDIENCE = 'smartvet-client';

/**
 * Read JWT_SECRET and throw unless it is at least 64 characters, so weak or
 * missing secrets fail before any token is issued or verified.
 */
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    // Require a strong secret before issuing or verifying tokens.
    if (!secret || secret.length < 64) {
        throw new Error(
            'JWT_SECRET is missing or too short. Check your .env file.'
        );
    }

    return secret;
}

// Hash a password before saving it to MongoDB.
/**
 * Hash a password with bcrypt after enforcing the 8-character minimum and the
 * 72-byte bcrypt input limit. Throws when either limit is violated.
 */
async function hashPassword(password) {
    if (typeof password !== 'string' || password.length < 8) {
        throw new Error(
            'Password must contain at least 8 characters.'
        );
    }

    // bcrypt has a 72-byte input limit.
    if (Buffer.byteLength(password, 'utf8') > 72) {
        throw new Error(
            'Password must not exceed 72 UTF-8 bytes.'
        );
    }

    return bcrypt.hash(password, BCRYPT_ROUNDS);
}

// Compare a supplied password with its stored hash.
/**
 * Compare a plaintext password with a stored bcrypt hash, returning false for
 * missing or non-string inputs instead of throwing.
 */
async function comparePassword(password, passwordHash) {
    if (
        typeof password !== 'string' ||
        typeof passwordHash !== 'string' ||
        passwordHash.length === 0
    ) {
        return false;
    }

    return bcrypt.compare(password, passwordHash);
}

// --- App-lock PIN helpers -------------------------------------------------
// Owners may set a numeric PIN (6-12 digits) that unlocks the app without
// typing their email and password. The PIN is hashed with bcrypt just like a
// password, and the endpoints that accept it are rate limited.
const PIN_MIN_LENGTH = 6;
const PIN_MAX_LENGTH = 6;
const PIN_ROUNDS = 10;
const PIN_PATTERN = new RegExp(`^\\d{${PIN_MIN_LENGTH},${PIN_MAX_LENGTH}}$`);

/**
 * Return true when `pin` is a string of exactly 6 digits.
 */
function isValidPin(pin) {
    return typeof pin === 'string' && PIN_PATTERN.test(pin);
}

/**
 * Hash a 6-digit PIN with bcrypt, throwing when the PIN fails `isValidPin`.
 */
async function hashPin(pin) {
    if (!isValidPin(pin)) {
        throw new Error('PIN must be exactly 6 digits.');
    }

    return bcrypt.hash(pin, PIN_ROUNDS);
}

/**
 * Compare a supplied PIN with its stored bcrypt hash, returning false for
 * missing or non-string inputs.
 */
async function comparePin(pin, pinHash) {
    if (
        typeof pin !== 'string' ||
        typeof pinHash !== 'string' ||
        pinHash.length === 0
    ) {
        return false;
    }

    return bcrypt.compare(pin, pinHash);
}

// Create a signed access token for an authenticated user.
// Store only the user's ID in the token; the backend will
// retrieve the current role and account status from MongoDB.
/**
 * Sign an HS256 JWT whose subject is the user id and whose expiry comes from
 * JWT_EXPIRES_IN (default 1h). Carries no role claim; roles are re-read from
 * MongoDB on each request.
 */
function createAccessToken(user) {
    if (!user || !user._id) {
        throw new Error('A valid user ID is required.');
    }

    const secret = getJwtSecret();
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    return jwt.sign(
        {},
        secret,
        {
            algorithm: 'HS256',
            subject: String(user._id),
            expiresIn,
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE
        }
    );
}

// Verify a token's signature, expiry, issuer, and audience.
/**
 * Verify a token's signature, expiry, issuer and audience, returning
 * `{ userId, expiresAt }`. Throws for missing tokens or an invalid payload.
 */
function verifyAccessToken(token) {
    if (typeof token !== 'string' || token.length === 0) {
        throw new Error('An authentication token is required.');
    }

    const payload = jwt.verify(token, getJwtSecret(), {
        algorithms: ['HS256'],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE
    });

    if (!payload || typeof payload.sub !== 'string') {
        throw new Error('Invalid authentication token payload.');
    }

    return {
        userId: payload.sub,
        expiresAt: payload.exp
            ? new Date(payload.exp * 1000)
            : null
    };
}

module.exports = {
    hashPassword,
    comparePassword,
    hashPin,
    comparePin,
    isValidPin,
    PIN_MIN_LENGTH,
    PIN_MAX_LENGTH,
    createAccessToken,
    verifyAccessToken
};
