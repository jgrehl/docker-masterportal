import menuNavigationState from "./stateMenuNavigation";
import {generateSimpleGetters} from "../../../../app-store/utils/generators";

const menuNavigationgetters = {
    ...generateSimpleGetters(menuNavigationState),
    /**
     * @param {Object} state module state
     * @returns {Object|null} last added menu navigation entry or null
     */
    lastEntry: state => state.entries[state.entries.length - 1] || null,
    /**
     * @param {Object} state module state
     * @returns {Object|null} previous added menu navigation entry or null
     */
    previousEntry: state => state.entries[state.entries.length - 2] || null,
    /**
     * @param {Object} _ module state (discarded)
     * @param {Object} getters module getters
     * @param {Object} __ root state (discarded)
     * @param {Object} rootGetters root getters
     * @returns {Object} previous added menu navigation entry or null
     */
    componentFromPath (_, getters, __, rootGetters) {
        return rootGetters["Menu/componentMap"][getters.objectFromPath.itemType];
    },
    /**
     * @param {Object} _ module state (discarded)
     * @param {Object} getters module getters
     * @param {Object} __ root state (discarded)
     * @param {Object} rootGetters root getters
     * @returns {Object} previous added menu navigation entry or null
     */
    objectFromPath (_, getters, __, rootGetters) {
        // eslint-disable-next-line new-cap
        return rootGetters["Menu/section"](getters.lastEntry);
    }
};

export default menuNavigationgetters;
