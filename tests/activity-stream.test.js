const assert = require('assert');
const EventEmitter = require('events');

const {
    subscribe,
    broadcast,
    subscriberCount
} = require('../src/services/activity-stream');

/**
 * Run the activity stream tests, checking delivery, pet scoping and teardown.
 */
function run() {
    const before = subscriberCount();
    const res = new EventEmitter();
    const frames = [];

    res.write = (chunk) => frames.push(chunk);

    subscribe(res, ['pet-a']);
    assert.strictEqual(subscriberCount(), before + 1);

    broadcast('pet-a', { id: 'a', activity: 'walking' });
    broadcast('pet-b', { id: 'b', activity: 'running' });

    assert.strictEqual(frames.length, 2, 'retry hint + one matching frame');
    assert.ok(frames[0].startsWith('retry: 3000'));
    assert.ok(frames[1].includes('"id":"a"'));
    assert.ok(!frames[1].includes('"id":"b"'), 'other owners are not notified');

    res.emit('close');
    assert.strictEqual(subscriberCount(), before, 'closed streams are removed');
}

run();
console.log('activity stream test passed');
