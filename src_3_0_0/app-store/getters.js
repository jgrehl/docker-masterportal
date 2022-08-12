import {generateSimpleGetters} from "./utils/generators";
import getNestedValues from "../utils/getNestedValues";
import flattenArray from "../utils/flattenArray";
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
        const layerContainer = flattenArray(getNestedValues(state.layerConfig, "Layer"));

        return layerContainer.filter(layerConf => layerConf.visibility === true);
    }
};

export default getters;
