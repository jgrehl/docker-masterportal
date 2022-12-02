import {generateSimpleMutations} from "../shared/js/utils/generators";
import replaceInNestedValues from "../shared/js/utils/replaceInNestedValues";
import stateAppStore from "./state";

const mutations = {
    ...generateSimpleMutations(stateAppStore),

    /**
     * Sets the object to states layerConfig under the given parentKey.
     * @param {Object} state store state
     * @param {Object} payload the payload
     * @param {Object[]} payload.layerConfigs object to set to the parentKey
     * @param {String} payload.parentKey the key of the parent object
     * @returns {void}
     */
    setLayerConfigByParentKey (state, {layerConfigs, parentKey}) {
        state.layerConfig[parentKey] = layerConfigs;
    },
    /**
     * Replaces the layer with the id of the layer toReplace in state's layerConfig.
     * @param {Object} state store state
     * @param {Object} [payload={}] the payload
     * @param {Object[]} [payload.layerConfigs=[]] Array of configs of layers to replace, and the id to match in state.layerConfigs
     * @param {Object} payload.layerConfigs.layer layerConfig
     * @param {String} payload.layerConfigs.id the id to match in state.layerConfigs
     * @param {Object} [payload.trigger=true] if true then getters are triggered
     * @returns {void}
     */
    replaceByIdInLayerConfig (state, {layerConfigs = [], trigger = true} = {}) {
        layerConfigs.forEach(config => {
            const replacement = config.layer,
                id = config.id,
                assigned = replaceInNestedValues(state.layerConfig, "Layer", replacement, {key: "id", value: id}, "Ordner");

            if (assigned.length > 1) {
                console.warn(`Replaced ${assigned.length} layers in state.layerConfig with id: ${id}. Layer was found ${assigned.length} times. You have to correct your config!`);
            }

            // necessary to trigger the getters
            if (trigger) {
                state.layerConfig = {...state.layerConfig};
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
