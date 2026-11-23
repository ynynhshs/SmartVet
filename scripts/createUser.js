
require('dotenv').config();

const readline = require('readline');
const mongoose = require('mongoose');

const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const VeterinaryUser = require('../src/models/VeterinaryUser');
const { hashPassword } = require('../src/services/authService');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt on stdin/stdout and resolve with the trimmed answer.
function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer.trim()));
    });
}

// Prompt for a secret without echoing it, reading raw keystrokes until Enter.
function askHidden(question) {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        const wasRaw = stdin.isRaw;

        process.stdout.write(question);

        let answer = '';

        // Restore the terminal and stop listening once the secret is entered.
        function cleanup() {
            stdin.removeListener('data', onData);
            if (stdin.isTTY) {
                stdin.setRawMode(Boolean(wasRaw));
            }
            process.stdout.write('\n');
        }

        // Accumulate printable characters, honour backspace and Ctrl+C.
        function onData(data) {
            const input = data.toString('utf8');

            for (const char of input) {
                if (char === '\u0003') {
                    cleanup();
                    rl.close();
                    process.exit(130);
                }

                if (char === '\r' || char === '\n') {
                    cleanup();
                    resolve(answer);
                    return;
                }

                if (char === '\u007f' || char === '\b') {
                    answer = answer.slice(0, -1);
                    continue;
                }

                if (char >= ' ') {
                    answer += char;
                }
            }
        }

        if (stdin.isTTY) {
            stdin.setRawMode(true);
        }

        stdin.on('data', onData);
    });
}

// Interactively collect account details and insert the owner or staff record.
async function createUser() {
    try {
        console.log('\n=== SmartVet Account Setup ===');
        console.log('Allowed roles: owner, veterinarian, veterinary_staff\n');

        const fullName = await ask('Full name: ');
        const email = (await ask('Email address: ')).toLowerCase();
        const phone = await ask('Phone number (optional): ');

        const role = (await ask(
            'Account role (owner/veterinarian/veterinary_staff): '
        )).toLowerCase();

        const allowedRoles = ['owner', 'veterinarian', 'veterinary_staff'];

        if (!allowedRoles.includes(role)) {
            throw new Error(
                `Invalid role. Allowed roles: ${allowedRoles.join(', ')}.`
            );
        }

        if (!fullName || fullName.length < 2) {
            throw new Error('Please enter a valid full name.');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Please enter a valid email address.');
        }

        // Emails are unique across both sign-in collections.
        const [existingOwner, existingStaff] = await Promise.all([
            User.findOne({ email }).select('_id'),
            VeterinaryUser.findOne({ email }).select('_id')
        ]);

        if (existingOwner || existingStaff) {
            throw new Error(
                'An account with that email address already exists.'
            );
        }

        const password = await askHidden('New password (hidden): ');
        const confirmPassword = await askHidden('Confirm password: ');

        if (password !== confirmPassword) {
            throw new Error('The passwords do not match.');
        }

        const passwordHash = await hashPassword(password);

        // Owners and clinic staff are stored in separate collections and
        // sign in on separate pages.
        const account =
            role === 'owner'
                ? await User.create({
                    fullName,
                    email,
                    phone,
                    passwordHash,
                    role,
                    status: 'active'
                })
                : await VeterinaryUser.create({
                    fullName,
                    email,
                    phone,
                    passwordHash,
                    role,
                    status: 'active'
                });

        console.log('\nAccount created successfully.');
        console.log(`Name: ${account.fullName}`);
        console.log(`Email: ${account.email}`);
        console.log(`Role: ${account.role}`);
        console.log(`Status: ${account.status}`);
        console.log(`Collection: ${role === 'owner' ? 'users' : 'veterinaryusers'}`);
        console.log(`Sign in: ${role === 'owner' ? '/login.html' : '/clinic/login.html'}`);
        console.log(`User ID: ${account._id}`);
    } finally {
        rl.close();
    }
}

// Open the database connection, run the prompt flow, then always disconnect.
async function main() {
    try {
        await connectDB();
        await createUser();
    } catch (error) {
        console.error('\nAccount creation failed:', error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
}

main();
