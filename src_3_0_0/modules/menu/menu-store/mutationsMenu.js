import menuState from "./stateMenu";
import {generateSimpleMutations} from "../../../shared/js/utils/generators";

export default {
    ...generateSimpleMutations(menuState),
    /**
     * Toggles Menucontainers
     * @param {Object} state current state
     * @param {String} side secondary or main Menu
     * @returns {void}
     */
    toggleMenu (state, side = {}) {
        if (side === "mainMenu") {
            state.mainMenuExpanded = !state.mainMenuExpanded;
        }
        else if (side === "secondaryMenu") {
            state.secondaryMenuExpanded = !state.secondaryMenuExpanded;
        }
    }
};
