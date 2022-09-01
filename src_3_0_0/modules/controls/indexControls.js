import getters from "./gettersControls";
import mutations from "./mutationsControls";
import state from "./stateControls";

import backForward from "./backForward/store/indexBackForward";

/**
 * controls-Module is required to be able to nest controls
 * in the store as ["controls", controlName].
 * Also holds information on control components and allows
 * addons to register themselves via mutation.
 */
export default {
    namespaced: true,
    modules: {
        backForward
    },
    getters,
    mutations,
    state
};
