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
     * Returns the active category configured in config.json unter 'tree'.
     * @param {Object} state state of the app-store.
     * @returns {Object|null} The active category or the first one or null if not found
     */
    activeOrFirstCategory: state => {
        const categories = state.portalConfig?.tree?.categories;

        if (Array.isArray(categories) && categories.length > 0) {
            const activeCategory = categories.filter(category => category.active === true);

            if (activeCategory) {
                return activeCategory[0];
            }
            return categories[0];
        }
        return null;
    },
    /**
     * Returns all layers of layerConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} The layers.
     */
    allLayerConfigs: state => {
        return getNestedValues(state.layerConfig, "Layer", "Ordner").flat(Infinity);
    },

    /**
     * Returns path to the cesium library.
     * @param {Object} state state of the app-store.
     * @returns {String} The cesium library path.
     */
    cesiumLibrary: state => {
        return state.configJs?.cesiumLibrary || "https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Cesium.js";
    },

    /**
     * Returns the controls configuration of portalConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object} The controls config.
     */
    controlsConfig: state => {
        return state.portalConfig?.controls || null;
    },

    /**
     * Returns the ui style of configJs.
     * @param {Object} state state of the app-store.
     * @returns {Object} The ui style.
     */
    uiStyle: state => {
        return state.configJs?.uiStyle?.toUpperCase() || "DEFAULT";
    },

    /**
     * Returns all visible layer configurations.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} Containing all layer configurations with property 'visibility' is true.
     */
    visibleLayerConfigs: (state) => {
        const layerContainer = getters.allLayerConfigs(state);

        return layerContainer.filter(layerConf => layerConf.visibility === true);
    },

    /**
     * Returns visible layers of layerConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} The visible layers.
     */
    visibleLayerConfigs: state => {
        let visibleLayers = [];

        Object.values(state.layerConfig).forEach(value => {
            visibleLayers = [...visibleLayers, ...value.Layer.filter(layer => layer.visibility === true)];
        });

        return visibleLayers;
    },

    /**
     * Returns all layers of layerConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} The layers.
     */
    allLayerConfigs: state => {
        let layers = [];

        Object.values(state.layerConfig).forEach(value => {
            layers = [...layers, ...value.Layer];
        });

        return layers;
    }
};

export default getters;
