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
            if (store.getters.isMobile && currentState.secondaryMenuExpanded) {
                currentState.secondaryMenuExpanded = false;
            }
            currentState.mainMenuExpanded = !currentState.mainMenuExpanded;
        }
        else if (side === "secondaryMenu") {
            if (store.getters.isMobile && currentState.mainMenuExpanded) {
                currentState.mainMenuExpanded = false;
            }
            currentState.secondaryMenuExpanded = !currentState.secondaryMenuExpanded;
        }
    }
};
