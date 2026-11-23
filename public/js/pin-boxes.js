// Six-digit PIN entry rendered as individual boxes.
// PINs are always exactly six digits, so every box holds one digit and the
// control can never contain more or fewer than six characters.
(function (global) {
    'use strict';

    const BOX_COUNT = 6;
    const DIGIT_PATTERN = /^\d$/;
    const instances = new WeakMap();

    /** Focuses a box and selects its content so typing replaces the digit. */
    function focusBox(input) {
        if (!input) return;

        input.focus();

        if (typeof input.select === 'function') {
            input.select();
        }
    }

    /** Toggles the is-filled class on every box based on whether it holds a digit. */
    function refreshBoxes(inputs) {
        inputs.forEach((input) => {
            input.classList.toggle('is-filled', input.value.length > 0);
        });
    }

    /**
     * Renders the six PIN boxes inside a container and returns their control
     * API; the container is marked is-masked when data-pin-mask is present.
     */
    function build(container) {
        const label = container.dataset.pinLabel || 'PIN';

        const grid = document.createElement('div');
        grid.className = container.hasAttribute('data-pin-mask')
            ? 'pin-boxes-grid is-masked'
            : 'pin-boxes-grid';

        const inputs = [];

        for (let index = 0; index < BOX_COUNT; index += 1) {
            const input = document.createElement('input');

            input.type = 'text';
            input.className = 'pin-box';
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('maxlength', '1');
            input.setAttribute('aria-label', `${label} digit ${index + 1}`);

            grid.appendChild(input);
            inputs.push(input);
        }

        container.appendChild(grid);
        refreshBoxes(inputs);

        /** Joins the current box values into the six-character PIN string. */
        function value() {
            return inputs.map((input) => input.value).join('');
        }

        /** Fires a bubbling pinchange event carrying the current value and its length. */
        function dispatchChange() {
            const current = value();

            container.dispatchEvent(new CustomEvent('pinchange', {
                bubbles: true,
                detail: { value: current, length: current.length }
            }));
        }

        inputs.forEach((input, index) => {
            // Keeps one digit per box, auto-advancing focus to the next box when a digit is entered.
            input.addEventListener('input', () => {
                // Only a single digit can live in a box.
                input.value = input.value.replace(/\D/g, '').slice(-1);
                refreshBoxes(inputs);

                if (input.value && index < inputs.length - 1) {
                    focusBox(inputs[index + 1]);
                }

                dispatchChange();
            });

            // Handles Backspace (clear, else step back), Delete, arrow navigation, and blocking non-digit keys.
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Backspace') {
                    if (input.value) {
                        input.value = '';
                        refreshBoxes(inputs);
                        dispatchChange();
                        return;
                    }

                    if (index > 0) {
                        event.preventDefault();
                        inputs[index - 1].value = '';
                        refreshBoxes(inputs);
                        focusBox(inputs[index - 1]);
                        dispatchChange();
                    }

                    return;
                }

                if (event.key === 'Delete') {
                    input.value = '';
                    refreshBoxes(inputs);
                    dispatchChange();
                    return;
                }

                if (event.key === 'ArrowLeft' && index > 0) {
                    event.preventDefault();
                    focusBox(inputs[index - 1]);
                    return;
                }

                if (event.key === 'ArrowRight' && index < inputs.length - 1) {
                    event.preventDefault();
                    focusBox(inputs[index + 1]);
                    return;
                }

                // Letters and symbols are never accepted.
                if (event.key && event.key.length === 1 && !DIGIT_PATTERN.test(event.key)) {
                    event.preventDefault();
                }
            });

            // Accepts a pasted string, distributes its digits across the boxes, and moves focus past the last filled box.
            input.addEventListener('paste', (event) => {
                event.preventDefault();

                const text = (event.clipboardData || global.clipboardData || {}).getData('text') || '';
                const digits = text.replace(/\D/g, '').slice(0, inputs.length);

                if (!digits) return;

                inputs.forEach((box, boxIndex) => {
                    box.value = digits[boxIndex] || '';
                });

                refreshBoxes(inputs);
                focusBox(inputs[Math.min(digits.length, inputs.length - 1)]);
                dispatchChange();
            });

            // Selects the box's content on focus so a new digit replaces it.
            input.addEventListener('focus', () => {
                if (typeof input.select === 'function') {
                    input.select();
                }
            });
        });

        return {
            inputs,
            grid,
            getValue: value,
            /** Replaces the PIN from a string, keeping only the first six digits. */
            setValue(nextValue) {
                const digits = String(nextValue || '')
                    .replace(/\D/g, '')
                    .slice(0, inputs.length);

                inputs.forEach((box, index) => {
                    box.value = digits[index] || '';
                });

                refreshBoxes(inputs);
                dispatchChange();
            },
            /** Adds one digit to the first empty box, ignoring non-digits, and advances focus. */
            append(digit) {
                const index = inputs.findIndex((box) => !box.value);

                if (index === -1) return;

                inputs[index].value = DIGIT_PATTERN.test(digit) ? digit : '';
                refreshBoxes(inputs);
                dispatchChange();

                if (index + 1 < inputs.length) {
                    focusBox(inputs[index + 1]);
                }
            },
            /**
             * Clears the box before the first empty one (or the last box when all
             * are filled) and focuses it.
             */
            backspace() {
                const firstEmpty = inputs.findIndex((box) => !box.value);
                const target = firstEmpty === -1
                    ? inputs.length - 1
                    : Math.max(0, firstEmpty - 1);

                inputs[target].value = '';
                refreshBoxes(inputs);
                focusBox(inputs[target]);
                dispatchChange();
            },
            /** Empties every box and returns focus to the first one. */
            clear() {
                inputs.forEach((box) => {
                    box.value = '';
                });

                refreshBoxes(inputs);
                focusBox(inputs[0]);
                dispatchChange();
            },
            /** Focuses the first empty box, or the last box when the PIN is complete. */
            focus() {
                const firstEmpty = inputs.findIndex((box) => !box.value);

                focusBox(firstEmpty === -1 ? inputs[inputs.length - 1] : firstEmpty);
            },
            /** Tells whether all six boxes hold a digit. */
            isComplete() {
                return value().length === inputs.length;
            }
        };
    }

    /**
     * Builds the PIN boxes for a container once and caches the instance in a
     * WeakMap, returning the existing API on repeat calls (or null for no container).
     */
    function init(container) {
        if (!container) return null;

        if (instances.has(container)) {
            return instances.get(container);
        }

        const api = build(container);
        instances.set(container, api);
        return api;
    }

    global.SmartVetPinBoxes = {
        BOX_COUNT,
        init,
        getInstance: init
    };

    document.querySelectorAll('[data-pin-boxes]').forEach(init);
})(window);
