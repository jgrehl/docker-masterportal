import menuNavigationState from "./stateMenuNavigation";
import {generateSimpleGetters} from "../../../../app-store/utils/generators";

const menuNavigationgetters = {
    ...generateSimpleGetters(menuNavigationState),
    /**
     * @param {Object} state module state
     * @returns {Object|null} last added menu navigation entry or null
     */
    lastEntry: state => side => state.entries[side][state.entries[side].length - 1] || null,
    /**
     * @param {Object} state module state
     * @returns {Object|null} previous added menu navigation entry or null
     */
    previousEntry: state => side => state.entries[side][state.entries[side].length - 2] || null
};

export default menuNavigationgetters;
