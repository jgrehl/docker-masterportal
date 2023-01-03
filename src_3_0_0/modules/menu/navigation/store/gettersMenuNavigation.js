import menuNavigationState from "./stateMenuNavigation";
import {generateSimpleGetters} from "../../../../shared/js/utils/generators";

const getters = {
    ...generateSimpleGetters(menuNavigationState),

    /**
     * @param {MenuNavigationState} state Local vuex state.
     * @returns {(function(side: String): any|null)} Last entry for the given menu.
     */
    lastEntry: state => side => {
        return state.entries[side][state.entries[side].length - 1] || null;
    },

    /**
     * @param {MenuNavigationState} state Local vuex state.
     * @returns {(function(side: String): any|null)} Second to last entry for the given menu.
     */
    previousEntry: state => side => {
        return state.entries[side][state.entries[side].length - 2] || null;
    },

    /**
     * Returns the entry for the given moduleType in the menu
     * @param {MenuNavigationState} state Local vuex state.
     * @param {Object} _  not used
     * @param {Object} __ not used
     * @param {Object} rootGetters the root getters
     * @param {String} side menu side
     * @param {String} moduleType type of the module
     * @returns {(function(side: String, moduleType: String): any|null)} The entry for the given moduleType in the menu.
     */
    isModuleActiveInMenu: (state, _, __, rootGetters) => (side, moduleType) => {
        const moduleIndex = rootGetters[`Menu/${side}`]?.sections[0].findIndex(sectionModule => {
            return sectionModule.type === moduleType;
        });

        return state.entries[side][0] && state.entries[side][0][state.entries[side][0].length - 1] === moduleIndex;
    }
};

export default getters;
