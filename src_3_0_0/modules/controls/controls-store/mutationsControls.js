import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateControls from "./stateControls";

export default {
    ...generateSimpleMutations(stateControls),

    /**
     * Registers a new control element.
     * Can be called e.g. by an addon, if Store is globally accessible.
     * @param {Object} state current state
     * @param {String} name name of control in config.json
     * @param {Object} control Vue Component
     * @param {Boolean} [hiddenMobile=false] whether component is visible in mobile resolution
     * @param {Boolean} [expandableControls=false] whether component is to be shown in the extended expandable
     * @returns {void}
     */
    registerControl (state, {name, control, hiddenMobile = false, expandableControls = false}) {
        state.componentMap = {
            ...state.componentMap,
            [name]: control
        };
        if (hiddenMobile) {
            state.mobileHiddenControls = [
                ...state.mobileHiddenControls,
                name
            ];
        }
        if (expandableControls) {
            state.expandableControls = [
                ...state.expandableControls,
                name
            ];
        }
    },

    /**
     * Removes a control element.
     * @param {Object} state current state
     * @param {String} name name of control to remove from state
     * @returns {void}
     */
    unregisterControl (state, name) {
        const nextMap = {...state.componentMap};

        delete nextMap[name];

        state.componentMap = nextMap;
        state.hiddenMobile = state.mobileHiddenControls.filter(s => s !== name);
        state.expandableControls = state.expandableControls.filter(s => s !== name);
    }
};
