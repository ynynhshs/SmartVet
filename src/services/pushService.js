const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@smartvet.local';

let vapidConfigured = false;

/**
 * Return true when both VAPID keys are present in the environment.
 */
function isPushConfigured() {
    return Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
}

/**
 * Lazily configure web-push with the VAPID details on first use and return
 * whether push delivery is configured.
 */
function ensureVapidDetails() {
    if (!vapidConfigured && isPushConfigured()) {
        webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
        vapidConfigured = true;
    }

    return vapidConfigured;
}

/**
 * Convert a stored PushSubscription document into the plain object shape the
 * web-push library expects, defaulting `expirationTime` to null.
 */
function toSubscriptionObject(subscription) {
    return {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime || null,
        keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth
        }
    };
}

// Deliver a notification to every browser the owner is subscribed with.
// Failures are isolated per subscription; dead subscriptions are removed.
/**
 * Deliver a notification to every stored subscription for a user. Results are
 * isolated per subscription with `Promise.allSettled`, and subscriptions the
 * push service reports as gone (404/410) are deleted. Returns `{ sent, total }`
 * or `{ sent: 0, reason }` when unconfigured or unsubscribed.
 */
async function sendPushToUser(userId, notification) {
    if (!ensureVapidDetails()) {
        return { sent: 0, reason: 'push-not-configured' };
    }

    const subscriptions = await PushSubscription.find({ userId });
    if (subscriptions.length === 0) {
        return { sent: 0, reason: 'no-subscriptions' };
    }

    const payload = JSON.stringify({
        title: notification.title || 'SmartVet',
        message: notification.message || '',
        url: notification.url || '/owner/dashboard.html',
        tag: notification.tag || `smartvet-${Date.now()}`
    });

    const results = await Promise.allSettled(
        subscriptions.map(async (subscription) => {
            try {
                await webpush.sendNotification(
                    toSubscriptionObject(subscription),
                    payload
                );
                return 'delivered';
            } catch (error) {
                // 404/410 mean the push service forgot this subscription.
                if (error.statusCode === 404 || error.statusCode === 410) {
                    await PushSubscription.deleteOne({ _id: subscription._id });
                }
                throw error;
            }
        })
    );

    return {
        sent: results.filter((result) => result.status === 'fulfilled').length,
        total: subscriptions.length
    };
}

module.exports = {
    sendPushToUser,
    isPushConfigured,
    ensureVapidDetails,
    VAPID_PUBLIC_KEY
};
