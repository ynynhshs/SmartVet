
const User = require('../models/User');
const VeterinaryUser = require('../models/VeterinaryUser');

const {
    verifyAccessToken
} = require('../services/authService');

// Require a valid token and an active user account.
/**
 * Require a Bearer access token and load the matching active account from
 * MongoDB, preferring the owner collection and falling back to VeterinaryUser.
 * Attaches a trusted `req.user` (role read from the database) and `req.auth`.
 */
async function requireAuth(req, res, next) {
    const authorization = req.get('authorization') || '';
    const match = authorization.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
        return res.status(401).json({
            success: false,
            message: 'Authentication is required.'
        });
    }

    let tokenData;

    // Verify signature, expiry, issuer, and audience.
    try {
        tokenData = verifyAccessToken(match[1]);
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token.'
        });
    }

    try {
        // Retrieve current account information from MongoDB.
        // Do not trust a role supplied by the browser or token.
        //
        // Two collections hold sign-in accounts: pet owners (`User`) and
        // veterinary staff (`VeterinaryUser`). Look up the owner first, then
        // fall back to the veterinary account, so one token resolves to
        // exactly one active account.
        let user = await User.findById(tokenData.userId)
            .select('_id fullName email role status');

        if (!user) {
            user = await VeterinaryUser.findById(tokenData.userId)
                .select('_id fullName email role status');
        }

        if (!user || user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Authentication is required.'
            });
        }

        // Make trusted user information available to later middleware
        // and route handlers.
        req.user = {
            id: user._id.toString(),
            _id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status
        };

        req.auth = {
            expiresAt: tokenData.expiresAt
        };

        return next();
    } catch (error) {
        // Pass unexpected database or server errors to Express.
        return next(error);
    }
}

// Restrict a route to one or more user roles.
// Example: authorizeRoles('admin', 'veterinary')
/**
 * Return middleware that allows only the listed roles through. Must run after
 * `requireAuth`; responds 401 without `req.user` and 403 for other roles.
 */
function authorizeRoles(...allowedRoles) {
    // Express middleware handed to the router.
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication is required.'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this resource.'
            });
        }

        return next();
    };
}

module.exports = {
    requireAuth,
    authorizeRoles
};
