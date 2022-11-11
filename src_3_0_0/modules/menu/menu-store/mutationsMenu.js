import menuState from "./stateMenu";
import store from "../../../app-store";
import {generateSimpleMutations} from "../../../shared/js/utils/generators";

export default {
    ...generateSimpleMutations(menuState),
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
