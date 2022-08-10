/**
 * Returns an object of simple getters for a state object, where
 * simple means that they will just return an entry for any key.
 * For example, given a state object {key: value}, an object
 * {key: state => state[key]} will be returned.
 * This is useful to avoid writing basic operations.
 * @param {Object} state state to generate getters for
 * @returns {Object.<String, Function>} object of getters
 */
export function generateSimpleGetters (state) {
    return Object.keys(state)
        .reduce((acc, key) => ({
            ...acc,
            [key]: s => s[key]
        }), {});
}
