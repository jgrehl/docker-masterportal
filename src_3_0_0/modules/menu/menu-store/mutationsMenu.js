import menuState from "./stateMenu";
import {generateSimpleMutations} from "../../../shared/js/utils/generators";

export default {
    ...generateSimpleMutations(menuState),

    /**
     * Collapses Menucontainers
     * @param {Object} state current state
     * @returns {void}
     */
    collapseMenues (state) {
        state.mainMenu.expanded = false;
        state.secondaryMenu.expanded = false;
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
     * Sets currently shown components props.
     * @param {Object} state current state
     * @param {String} side secondary or main Menu
     * @param {String} props props of component
     * @returns {void}
     */
    setCurrentComponentProps (state, {side, props}) {
        state[side].navigation.currentComponent.props = props;
    },


    /**
     * Sets current MenuWidth
     * @param {Object} state current state
     * @param {String} side secondary or main Menu
     * @param {String} width width Value
     * @returns {void}
     */
    setCurrentMenuWidth (state, {side, width}) {
        state[side].width = width;
    },

    /**
     * Set expanded for the given side menu.
     * @param {Object} state current state
     * @param {Boolean} expanded Is menu expanded.
     * @param {String} side secondary or main Menu
     * @returns {void}
     */
    setExpandedBySide (state, {expanded, side}) {
        state[side].expanded = expanded;
    },

    /**
     * Removes the last path of an entry from the given side.
     * @param {Object} state Local vuex state.
     * @param {String} side Side on which the last entry should be removed.
     * @returns {void}
     */
    switchToPreviousComponent (state, side) {
        if (state[side].navigation.history.slice(-1)[0]?.type) {
            state[side].navigation.currentComponent = {type: state[side].navigation.history.slice(-1)[0].type, props: state[side].navigation.history.slice(-1)[0].props};
            state[side].currentComponent = state[side].navigation.history.slice(-1)[0].type;
        }
        state[side].navigation.history.pop();
    },

    /**
     * Switches back to root of side's navigation.
     * @param {Object} state Local vuex state.
     * @param {String} side Side on which the last entry should be removed.
     * @returns {void}
     */
    switchToRoot (state, side) {
        state[side].navigation.currentComponent = {props: [], type: "root"};
        state[side].navigation.history = [];
        state[side].currentComponent = "root";
    }
};
