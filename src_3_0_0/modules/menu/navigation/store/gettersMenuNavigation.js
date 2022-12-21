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

    isModuleActiveInMenu: (state, _, __, rootGetters) => (side, moduleType) => {
        const moduleIndex = rootGetters[`Menu/${side}`]?.sections[0].findIndex(sectionModule => {
            return sectionModule.type === moduleType;
        });

        return state.entries[side][0] && state.entries[side][0][state.entries[side][0].length - 1] === moduleIndex;
    },
    getPath: (state, _, __, rootGetters) => (side, moduleType) => {
        const moduleIndex = rootGetters[`Menu/${side}`]?.sections[0].findIndex(sectionModule => {
            return sectionModule.type === moduleType;
        });

        if (state.entries[side][0][state.entries[side][0].length - 1] === moduleIndex) {
            return state.entries[side][0];
        }
        return null;
    }
};

export default getters;
