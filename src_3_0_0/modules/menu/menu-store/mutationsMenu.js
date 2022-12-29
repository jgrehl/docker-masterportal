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
    },

    /**
     * Collapses Menucontainers
     * @param {Object} currentState current state
     * @returns {void}
     */
    collapseMenues (currentState) {
        currentState.mainMenu.expanded = false;
        currentState.secondaryMenu.expanded = false;
    },

    /**
     * Sets current shown Component
     * @param {Object} currentState current state
     * @param {String} side secondary or main Menu
     * @param {String} component Type of Component
     * @returns {void}
     */
    setCurrentComponent (currentState, {side, component}) {
        currentState[side].currentComponent = component;
    },
    /**
     * Adds a path for a menu entry to the entries.
     * @param {Object} state Local vuex state.
     * @param {Array} path Path to a menu entry.
     * @returns {void}
     */
    addEntry (state, {component, side}) {

        state[side].navigation.history.push(state[side].navigation.currentComponent);
        state[side].navigation.currentComponent = component;
    },
    /**
     * Removes the last path of an entry from the given side.
     * @param {Object} state Local vuex state.
     * @param {String} side Side on which the last entry should be removed.
     * @returns {void}
     */
    switchToLastEntry (state, side) {
        state[side].navigation.currentComponent = state[side].navigation.history[0];
        state[side].navigation.history.pop();
    },

    /**
     * Reset the one menu entry.
     * @param {Object} state Local vuex state.
     * @param {String} side The side to reset.
     * @returns {void}
     */
    resetEntry (state, side) {
        state[side].navigation.history = [];
    }
};
