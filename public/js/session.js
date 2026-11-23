// Shared session storage for SmartVet.
// The access token is persisted so a page refresh or a new tab stays signed in.
(function (global) {
    'use strict';

    const TOKEN_KEY = 'smartvetAccessToken';
    const USER_KEY = 'smartvetUser';
    // Remembers which owner account has a PIN so the login page can offer a
    // fast PIN unlock on the next visit.
    const PIN_ACCOUNT_KEY = 'smartvetPinAccount';

    /**
     * Reads a key from the given storage wrapper, returning null instead of
     * throwing when storage is unavailable (for example in private browsing).
     */
    function safeGet(storage, key) {
        try {
            return storage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    /**
     * Writes a key to the given storage wrapper and swallows any quota or
     * privacy-mode failure so callers never have to handle it.
     */
    function safeSet(storage, key, value) {
        try {
            storage.setItem(key, value);
        } catch (error) {
            // Storage can be unavailable in private browsing mode.
        }
    }

    /**
     * Removes a key from the given storage wrapper, ignoring storage that is
     * unavailable or blocked.
     */
    function safeRemove(storage, key) {
        try {
            storage.removeItem(key);
        } catch (error) {
            // Ignore unavailable storage.
        }
    }

    // Older builds handed the token over in sessionStorage. Migrate it once so
    // an existing session survives the upgrade without another sign-in.
    /**
     * Reads a key from localStorage, falling back to a legacy sessionStorage
     * copy and migrating it into localStorage when one is found.
     */
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

    /**
     * Persists a key to localStorage and clears any sessionStorage leftover so
     * the two stores never disagree.
     */
    function write(key, value) {
        safeSet(global.localStorage, key, value);
        safeRemove(global.sessionStorage, key);
    }

    /**
     * Clears a key from both localStorage and sessionStorage.
     */
    function remove(key) {
        safeRemove(global.localStorage, key);
        safeRemove(global.sessionStorage, key);
    }

    global.SmartVetSession = {
        /** Returns the persisted access token, or null when signed out. */
        getToken() {
            return read(TOKEN_KEY);
        },

        /**
         * Returns the cached signed-in user object, or null when the cached
         * value is missing or is not valid JSON.
         */
        getUser() {
            const raw = read(USER_KEY);
            if (!raw) return null;

            try {
                return JSON.parse(raw);
            } catch (error) {
                return null;
            }
        },

        /**
         * Stores the access token (required, must be a non-empty string) and
         * optionally the user object; both are kept in localStorage.
         */
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

        /** Removes the token and cached user, leaving the PIN account intact. */
        clear() {
            remove(TOKEN_KEY);
            remove(USER_KEY);
        },

        /**
         * Returns the remembered owner account ({ email, fullName }) for the
         * login page's PIN unlock, or null when it is missing or malformed.
         */
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

        /**
         * Remembers an owner account's email and full name for the PIN unlock,
         * throwing when no usable email is supplied.
         */
        savePinAccount(user) {
            if (!user || typeof user.email !== 'string' || user.email.length === 0) {
                throw new Error('A saved account requires an email address.');
            }

            write(PIN_ACCOUNT_KEY, JSON.stringify({
                email: user.email,
                fullName: String(user.fullName || '')
            }));
        },

        /** Forgets the remembered PIN account so the login page stops offering the fast unlock. */
        clearPinAccount() {
            remove(PIN_ACCOUNT_KEY);
        }
    };
})(window);
