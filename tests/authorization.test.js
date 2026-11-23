
const assert = require('node:assert/strict');

const {
    authorizeRoles
} = require('../src/middleware/authMiddleware');

let passed = 0;
let failed = 0;

/**
 * Records the outcome of one assertion by incrementing the pass/fail counter
 * and printing a matching PASS or FAIL line.
 */
function check(description, condition) {
    if (!condition) {
        failed++;
        console.error(`FAIL: ${description}`);
        return;
    }

    passed++;
    console.log(`PASS: ${description}`);
}

/**
 * Builds minimal req/res/next stubs, invokes authorizeRoles with the requested
 * roles, and returns the recorded status, body, and whether next() fired.
 */
function runAuthorization(allowedRoles, userRole) {
    const req = {
        user: userRole
            ? { role: userRole }
            : undefined
    };

    const res = {
        statusCode: null,
        body: null,

        // Express-like status() stub that records the HTTP status code and stays chainable.
        status(code) {
            this.statusCode = code;
            return this;
        },

        // Express-like json() stub that records the response body and stays chainable.
        json(body) {
            this.body = body;
            return this;
        }
    };

    let nextCalled = false;

    authorizeRoles(...allowedRoles)(
        req,
        res,
        // Marks next() as invoked so the helper can detect that access was granted.
        () => {
            nextCalled = true;
        }
    );

    return {
        statusCode: res.statusCode,
        body: res.body,
        nextCalled
    };
}

/**
 * Asserts that a user holding userRole is allowed through: next() must run and
 * no error status may be written.
 */
function expectAllowed(label, allowedRoles, userRole) {
    const result = runAuthorization(allowedRoles, userRole);

    check(
        label,
        result.nextCalled &&
        result.statusCode === null
    );
}

/**
 * Asserts that a user holding userRole is rejected: next() must not run and a
 * 403 status must be written.
 */
function expectDenied(label, allowedRoles, userRole) {
    const result = runAuthorization(allowedRoles, userRole);

    check(
        label,
        !result.nextCalled &&
        result.statusCode === 403
    );
}

console.log('\n=== ROLE AUTHORIZATION TESTS ===');

// Administrator API area.
expectAllowed(
    'Admin can access the admin area',
    ['admin'],
    'admin'
);

expectDenied(
    'Veterinary personnel cannot access the admin area',
    ['admin'],
    'veterinary'
);

expectDenied(
    'Pet owners cannot access the admin area',
    ['admin'],
    'owner'
);

// Veterinary clinic API area.
expectAllowed(
    'Veterinary personnel can access the clinic area',
    ['veterinary'],
    'veterinary'
);

expectDenied(
    'Admins cannot access the clinic area under the current policy',
    ['veterinary'],
    'admin'
);

expectDenied(
    'Pet owners cannot access the clinic area',
    ['veterinary'],
    'owner'
);

// Pet owner API area.
expectAllowed(
    'Pet owners can access the owner area',
    ['owner'],
    'owner'
);

expectDenied(
    'Admins cannot access the owner area under the current policy',
    ['owner'],
    'admin'
);

expectDenied(
    'Veterinary personnel cannot access the owner area under the current policy',
    ['owner'],
    'veterinary'
);

// Unauthenticated request.
const unauthenticated = runAuthorization(
    ['admin'],
    undefined
);

check(
    'Requests without an authenticated user are rejected with 401',
    !unauthenticated.nextCalled &&
    unauthenticated.statusCode === 401
);

console.log('\n=== TEST SUMMARY ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total:  ${passed + failed}`);

if (failed > 0) {
    process.exitCode = 1;
} else {
    console.log('\nAll role authorization tests passed.');
}
