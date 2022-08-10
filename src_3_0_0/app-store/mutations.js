import {generateSimpleMutations} from "./utils/generators";
import stateAppStore from "./state";

const mutations = {
    ...generateSimpleMutations(stateAppStore),

    /**
     * Replaces the layer with the id of the layer toReplace in state's layerConfig.
     * @param {Object} state store state
     * @param {Object} toReplace config of one layer to replace, must contain id
     * @returns {void}
     */
    replaceByIdInLayerConfig (state, toReplace) {
        const indexBackGroundLayer = state.layerConfig?.Hintergrundkarten?.Layer?.findIndex((layerConf) => layerConf.id === toReplace?.id),
            indexSubjectDataLayer = state.layerConfig?.Fachdaten?.Layer?.findIndex((layerConf) => layerConf.id === toReplace?.id);

        if (indexBackGroundLayer > -1) {
            state.layerConfig?.Hintergrundkarten?.Layer?.splice(indexBackGroundLayer, 1, toReplace);
        }
        if (indexSubjectDataLayer > -1) {
            state.layerConfig?.Fachdaten?.Layer?.splice(indexSubjectDataLayer, 1, toReplace);
        }
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
