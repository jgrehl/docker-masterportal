import Attributions from "./attributions/Attributions.vue";
import BackForward from "./backForward/BackForward.vue";
import Zoom from "./zoom/Zoom.vue";

/**
 * controls-Module is required to be able to nest controls
 * in the store as ["controls", controlName].
 * Also holds information on control components and allows
 * addons to register themselves via mutation.
 */
export default {
    namespaced: true,
    state: {
        // initial state - information on all controls that are not addons.
        componentMap: {
            attributions: Attributions,
            backForward: BackForward,
            zoom: Zoom
        },
        mobileHiddenControls: [
            "backForward"
        ]
    },
    mutations: {
        /**
         * Registers a new control element.
         * Can be called e.g. by an addon, if Store is globally accessible.
         * @param {object} state current state
         * @param {string} name name of control in config.json
         * @param {object} control Vue Component
         * @param {boolean} [hiddenMobile=false] whether component is visible in mobile resolution
         * @returns {void}
         */
        registerModule (state, name, control, hiddenMobile = false) {
            state.componentMap = {
                ...state.componentMap,
                [name]: control
            };
            if (hiddenMobile) {
                state.hiddenMobile = [
                    ...state.hiddenMobile,
                    name
                ];
            }
        },
        /**
         * Removes a control element.
         * @param {object} state current state
         * @param {string} name name of control to remove from state
         * @returns {void}
         */
        unregisterModule (state, name) {
            const nextMap = {...state.componentMap};

            delete nextMap[name];

            state.componentMap = nextMap;
            state.mobileHiddenControls = state.mobileHiddenControls.filter(s => s !== name);
        }
    },
    getters: {
        componentMap: state => state.componentMap,
        mobileHiddenControls: state => state.mobileHiddenControls
    }
};
