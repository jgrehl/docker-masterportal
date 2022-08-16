import {generateSimpleMutations} from "./utils/generators";
import stateAppStore from "./state";

const mutations = {
    ...generateSimpleMutations(stateAppStore),

    /**
     * Sets the loaded config to true.
     * @param {Object} state store state
     * @param {String} config The config that is loaded
     * @returns {void}
     */
    setLoadedConfigs (state, config) {
        state.loadedConfigs[config] = true;
    }
};

export default mutations;
