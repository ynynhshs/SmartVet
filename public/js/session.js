// Shared session storage for SmartVet.
// The access token is persisted so a page refresh or a new tab stays signed in.
(function (global) {
    'use strict';

    const TOKEN_KEY = 'smartvetAccessToken';
    const USER_KEY = 'smartvetUser';
    // Remembers which owner account has a PIN so the login page can offer a
    // fast PIN unlock on the next visit.
    const PIN_ACCOUNT_KEY = 'smartvetPinAccount';

    function safeGet(storage, key) {
        try {
            return storage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function safeSet(storage, key, value) {
        try {
            storage.setItem(key, value);
        } catch (error) {
            // Storage can be unavailable in private browsing mode.
        }
    }

    function safeRemove(storage, key) {
        try {
            storage.removeItem(key);
        } catch (error) {
            // Ignore unavailable storage.
        }
    }

    // Older builds handed the token over in sessionStorage. Migrate it once so
    // an existing session survives the upgrade without another sign-in.
    function read(key) {
        let value = safeGet(global.localStorage, key);
        if (!value) {
            value = safeGet(global.sessionStorage, key);
            if (value) {
                safeSet(global.localStorage, key, value);
            }
        }
        return value;
    }

    function write(key, value) {
        safeSet(global.localStorage, key, value);
        safeRemove(global.sessionStorage, key);
    }

    function remove(key) {
        safeRemove(global.localStorage, key);
        safeRemove(global.sessionStorage, key);
    }

    global.SmartVetSession = {
        getToken() {
            return read(TOKEN_KEY);
        },

        getUser() {
            const raw = read(USER_KEY);
            if (!raw) return null;

            try {
                return JSON.parse(raw);
            } catch (error) {
                return null;
            }
        },

        save(token, user) {
            if (typeof token !== 'string' || token.length === 0) {
                throw new Error('A valid access token is required.');
            }

            write(TOKEN_KEY, token);

            if (user) {
                safeSet(global.localStorage, USER_KEY, JSON.stringify(user));
                safeRemove(global.sessionStorage, USER_KEY);
            }
        },

        clear() {
            remove(TOKEN_KEY);
            remove(USER_KEY);
        },

        getPinAccount() {
            const raw = read(PIN_ACCOUNT_KEY);
            if (!raw) return null;

            try {
                const parsed = JSON.parse(raw);

                if (!parsed || typeof parsed.email !== 'string' || parsed.email.length === 0) {
                    return null;
                }

                return {
                    email: parsed.email,
                    fullName: typeof parsed.fullName === 'string' ? parsed.fullName : ''
                };
            } catch (error) {
                return null;
            }
        },

        savePinAccount(user) {
            if (!user || typeof user.email !== 'string' || user.email.length === 0) {
                throw new Error('A saved account requires an email address.');
            }

            write(PIN_ACCOUNT_KEY, JSON.stringify({
                email: user.email,
                fullName: String(user.fullName || '')
            }));
        },

        clearPinAccount() {
            remove(PIN_ACCOUNT_KEY);
        }
    };
})(window);
