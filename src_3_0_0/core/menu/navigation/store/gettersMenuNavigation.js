import menuNavigationState from "./stateMenuNavigation";
import {generateSimpleGetters} from "../../../../app-store/utils/generators";

const getters = {
    ...generateSimpleGetters(menuNavigationState),
    /**
     * @param {MenuNavigationState} state Local vuex state.
     * @returns {(function(side: String): any|null)} Last entry for the given menu.
     */
    lastEntry: state => side => state.entries[side][state.entries[side].length - 1] || null,
    /**
     * @param {MenuNavigationState} state Local vuex state.
     * @returns {(function(side: String): any|null)} Second to last entry for the given menu.
     */
    previousEntry: state => side => state.entries[side][state.entries[side].length - 2] || null
};

export default getters;
