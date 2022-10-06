import menuNavigationState from "./stateMenuNavigation";
import {generateSimpleGetters} from "../../../../app-store/utils/generators";

const getters = {
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
    previousEntry: state => state.entries[state.entries.length - 2] || null
};

export default getters;
