import {generateSimpleGetters} from "./utils/generators";
import getNestedValues from "../utils/getNestedValues";
import stateAppStore from "./state";

const getters = {
    ...generateSimpleGetters(stateAppStore),

    /**
     * Returns whether all configs were loaded.
     * @param {Object} state state of the app-store.
     * @returns {Boolean} True, if all configs are loaded.
     */
    allConfigsLoaded: state => {
        return Object.values(state.loadedConfigs).every(value => value === true);
    },

    /**
     * Returns all visible layer configurations;
     * @param {Object} state state of the app-store.
     * @returns {Array} containing all layer configurations with property 'visibility' is true
     */
    allVisibleLayerConfigs: state => {
        const layerContainer = getNestedValues(state.layerConfig, "Layer"),
            visibleLayers = [];


        layerContainer.forEach(content => {
            if (Array.isArray(content)) {
                content.forEach(layerConf => {
                    if (layerConf.visibility) {
                        visibleLayers.push(layerConf);
                    }
                });
            }
            else if (content.visibility) {
                visibleLayers.push(content);
            }
        });

        return visibleLayers;
    }
};

export default getters;
