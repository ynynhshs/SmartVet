// In-process server-sent event (SSE) stream for new collar activity records.
// Each open owner dashboard keeps one subscription; a collar submission
// broadcasts to the subscriptions that own that pet so the page updates
// instantly without pressing Refresh or reloading the app.
const subscribers = new Set();

/**
 * Register an open SSE response for one owner's pets. The caller keeps the
 * response headers open (no body is sent) and writes heartbeats to stop proxies
 * from closing an idle connection. Subscriptions are removed automatically
 * when the client disconnects.
 *
 * @param {object} res Express response with SSE headers already flushed.
 * @param {Array<string>} petIds IDs of the pets this owner is allowed to see.
 */
function subscribe(res, petIds = []) {
    const entry = {
        res,
        petIds: new Set(petIds.map((id) => String(id))),
        heartbeat: null
    };

    subscribers.add(entry);

    // Tell EventSource to retry after 3 seconds if the connection drops.
    res.write('retry: 3000\n\n');

    entry.heartbeat = setInterval(() => {
        try {
            res.write(': heartbeat\n\n');
        } catch (error) {
            subscribers.delete(entry);
            clearInterval(entry.heartbeat);
        }
    }, 15000);

    res.on('close', () => {
        subscribers.delete(entry);
        clearInterval(entry.heartbeat);
    });

    return entry;
}

/**
 * Push a newly recorded activity to every subscriber that owns the pet.
 * Subscribers for other owners are skipped so activity never crosses accounts.
 *
 * @param {string} petId ID of the pet the reading belongs to.
 * @param {object} event Client-ready activity record.
 */
function broadcast(petId, event) {
    const payload = `data: ${JSON.stringify({
        type: 'activity.record',
        record: event
    })}\n\n`;

    for (const entry of subscribers) {
        if (!entry.petIds.has(String(petId))) {
            continue;
        }

        try {
            entry.res.write(payload);
        } catch (error) {
            subscribers.delete(entry);
            clearInterval(entry.heartbeat);
        }
    }
}

/** Number of open owner streams (used by the smoke test). */
function subscriberCount() {
    return subscribers.size;
}

module.exports = { subscribe, broadcast, subscriberCount };
