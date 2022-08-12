import {generateSimpleMutations} from "./utils/generators";
import replaceInNestedValues from "../utils/replaceInNestedValues";
import stateAppStore from "./state";

const mutations = {
    ...generateSimpleMutations(stateAppStore),

    /**
     * Adds the object to states layerConfig under the given parentKey.
     * @param {Object} state store state
     * @param {Object} payload the payload
     * @param {Array} payload.toAdd object to add to the parentKey
     * @param {String} payload.parentKey the key of the parent object
     * @returns {void}
     */
    addToLayerConfig (state, {toAdd, parentKey}) {
        state.layerConfig[parentKey] = toAdd;
    },

    /**
     * Replaces the layer with the id of the layer toReplace in state's layerConfig.
     * @param {Object} state store state
     * @param {Array} toReplace array of configs of layers to replace, each config must contain id
     * @returns {void}
     */
    replaceByIdInLayerConfig (state, toReplace = []) {
        toReplace.forEach(replacement => {
            const assigned = replaceInNestedValues(state.layerConfig, "Layer", replacement, {key: "id", value: replacement.id});

            if (assigned === 0) {
                console.warn("Replacement of layer ", toReplace, " in state.layerConfig failed. Id ", replacement.id, " was not found in state!");
            }
            else if (assigned > 1) {
                console.warn("Replaced ", assigned.length, " layers in state.layerConfig with ", replacement, " Id ", replacement.id, " was found ", assigned.length, " times. You have to correct your config!");
            }
        });
    },

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
