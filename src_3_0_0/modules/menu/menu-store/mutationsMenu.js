import menuState from "./stateMenu";
import store from "../../../app-store";
import {generateSimpleMutations} from "../../../shared/js/utils/generators";

export default {
    ...generateSimpleMutations(menuState),

    /**
     * Adds a module state to a menu side section.
     * @param {Object} state the state
     * @param {Object} module Type of a module.
     * @returns {void}
     */
    addModuleToMenuSection (state, {side, module}) {
        state[side].sections[0].push(module);
    },

    /**
     * Toggles Menucontainers
     * @param {Object} currentState current state
     * @param {String} side secondary or main Menu
     * @returns {void}
     */
    toggleMenu (currentState, side = {}) {
        if (side === "mainMenu") {
            if (store.getters.isMobile && currentState.secondaryMenu.expanded) {
                currentState.secondaryMenu.expanded = false;
            }
            currentState.mainMenu.expanded = !currentState.mainMenu.expanded;
        }
        else if (side === "secondaryMenu") {
            if (store.getters.isMobile && currentState.mainMenu.expanded) {
                currentState.mainMenu.expanded = false;
            }
            currentState.secondaryMenu.expanded = !currentState.secondaryMenu.expanded;
        }
    }
};
