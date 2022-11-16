import stateMenuNavigation from "./stateMenuNavigation";
import {generateSimpleMutations} from "../../../../shared/js/utils/generators";

export default {
    ...generateSimpleMutations(stateMenuNavigation),

    /**
     * Adds a path for a menu entry to the entries.
     * @param {Object} state Local vuex state.
     * @param {Array} path Path to a menu entry.
     * @returns {void}
     */
    addEntry (state, path) {
        state.entries[path[0]].push(path);
    },
    /**
     * Removes the last path of an entry from the given side.
     * @param {Object} state Local vuex state.
     * @param {String} side Side on which the last entry should be removed.
     * @returns {void}
     */
    removeLastEntry (state, side) {
        state.entries[side].pop();
    },

    /**
     * Reset the one menu entry.
     * @param {Object} state Local vuex state.
     * @param {String} side The side to reset.
     * @returns {void}
     */
    setEntry (state, side) {
        state.entries[side] = [];
    }
};
