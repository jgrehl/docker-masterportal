import menuState from "./stateMenu";
import store from "../../../app-store";
import {generateSimpleMutations} from "../../../shared/js/utils/generators";

export default {
    ...generateSimpleMutations(menuState),

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
     * Merge the menu state by side.
     * @param {Object} state current state
     * @param {Object} menu The menu setting.
     * @param {String} side secondary or main Menu
     * @returns {void}
     */
    mergeMenuState (state, {menu, side}) {
        Object.assign(state[side], menu);
    },

    /**
     * Sets currently shown Component
     * @param {Object} state current state
     * @param {String} side secondary or main Menu
     * @param {String} component Type of Component
     * @returns {void}
     */
    setCurrentComponent (state, {type, side, props}) {
        state[side].navigation.history.push(state[side].navigation.currentComponent);
        state[side].navigation.currentComponent = {type: type, props: props};
        state[side].currentComponent = type;
    },

    /**
     * Removes the last path of an entry from the given side.
     * @param {Object} state Local vuex state.
     * @param {String} side Side on which the last entry should be removed.
     * @returns {void}
     */
    switchToPreviousComponent (state, side) {
        state[side].navigation.currentComponent = {type: state[side].navigation.history.slice(-1)[0].type, props: state[side].navigation.history.slice(-1)[0].props};
        state[side].currentComponent = state[side].navigation.history.slice(-1)[0].type;
        state[side].navigation.history.pop();
    },

    /**
     * Switches back to root of side's navigation.
     * @param {Object} state Local vuex state.
     * @param {String} side Side on which the last entry should be removed.
     * @returns {void}
     */
    switchToRoot (state, side) {
        state[side].navigation.currentComponent = state[side].navigation.history[0];
        state[side].navigation.history = [];
        state[side].currentComponent = "root";
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
