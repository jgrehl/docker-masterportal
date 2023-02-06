import {generateSimpleGetters} from "../shared/js/utils/generators";
import getNestedValues from "../shared/js/utils/getNestedValues";
import stateAppStore from "./state";
import {treeBackgroundsKey, treeSubjectsKey} from "../shared/js/utils/constants";

const getters = {
    ...generateSimpleGetters(stateAppStore),
    treeHighlightedFeatures: state => state?.portalConfig?.tree?.highlightedFeatures || false,

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
        return getNestedValues(state.layerConfig, "elements", true).flat(Infinity);
    },

    /**
     * Returns all layers configs under the given parent-key.
     * @param {Object} state state of the app-store.
     * @param {String} parentKey the parentKey
     * @returns {Object[]} all layers configs under the given parent-key.
     */
    allLayerConfigsByParentKey: state => (parentKey) => {
        return getNestedValues(state.layerConfig[parentKey], "elements", true).flat(Infinity);
    },

    /**
     * Returns all subject data layers of layerConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} The layers.
     */
    allSubjectDataLayerConfigs: state => {
        return getters.allLayerConfigsByParentKey(state)(treeSubjectsKey);
    },

    /**
     * Returns path to the cesium library.
     * @param {Object} state state of the app-store.
     * @returns {String} The cesium library path.
     */
    cesiumLibrary: state => {
        return state.configJs?.cesiumLibrary || "https://cesium.com/downloads/cesiumjs/releases/1.100/Build/Cesium/Cesium.js";
    },

    /**
     * Returns the controls configuration of portalConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object} The controls config.
     */
    controlsConfig: state => {
        return state.portalConfig?.controls || {};
    },

    /**
     * Returns the ignored keys configuration of config.js.
     * @param {Object} state state of the app-store.
     * @returns {String[]} The ignored keys config.
     */
    ignoredKeys: state => {
        return state.configJs?.ignoredKeys || [];
    },

    /**
     * Returns if mobile device is used.
     * @param {Object} state state of the app-store.
     * @returns {Boolean} Mobile is used.
     */
    isMobile: state => {
        return state.deviceMode === "Mobile";
    },

    /**
     * Returns the menu by side of the portalConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object} Main menu.
     */
    menuFromConfig: state => side => {
        return state.portalConfig[side] || {};
    },

    /**
     * Returns the mapView settings configuration of portalConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object} The controls config.
     */
    mapViewSettings: state => {
        return state.portalConfig?.mapView || {};
    },

    /**
     * Returns a rest service from restConf by ID
     * @param {Object} state the store state
     * @param {String} id The id for rest service
     * @returns {Object} the rest service config object
     */
    restServiceById: state => id => {
        return state?.restConfig?.find(service => service.id === id);
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
     * Returns all visible layer configurations.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} Containing all layer configurations with property 'visibility' is true.
     */
    visibleSubjectDataLayerConfigs: (state) => {
        const layerContainer = getters.allSubjectDataLayerConfigs(state);

        return layerContainer.filter(layerConf => layerConf.visibility === true);
    },

    /**
     * Returns all layer-configs structured with children. If key of first level is given, only the layer-configs under this key are returned.
     * @param {Object} state state of the app-store.
     * @param {String|null} key of first level to get the configs for. If null all configs are returned.
     * @returns {Array} layer-configs structured with children
     */
    allLayerConfigsStructured: (state) => (key = null) =>{
        const configs = [];

        Object.keys(state.layerConfig).forEach(layerConfigKey => {
            if (!key || layerConfigKey === key) {
                Object.keys(state.layerConfig[layerConfigKey]).forEach(subKey => {
                    if (Array.isArray(state.layerConfig[layerConfigKey][subKey])) {
                        state.layerConfig[layerConfigKey][subKey].forEach(conf => {
                            configs.push(conf);
                        });
                    }
                });
            }
        });
        return configs;
    },

    /**
     * Filters the layer configs by the given attributes.
     * @param {Object} state state of the app-store.
     * @param {Object} attributes to filter the layer configs by
     * @returns {Array} filtered layer configs by the given attributes
     */
    layerConfigsByAttributes: (state) => (attributes = {}) =>{
        const layerContainer = getters.allLayerConfigs(state);

        return layerContainer.filter(layerConf => {
            return Object.entries(attributes).every(([key, value]) => {
                // @todo implementieren
                if (typeof value === "object") {
                    throw Error("Not implemented for objects values", value);
                }
                else if (Array.isArray(value)) {
                    throw Error("Not implemented for array values", value);
                }
                return layerConf[key] === value;
            });
        });
    },

    /**
     * Returns the layer configuration with the given id.
     * @param {Object} state state of the app-store.
     * @param {String} id id of the layer
     * @returns {Object|null}} the layer configuration with the given id
     */
    layerConfigById: (state) => (id) => {
        const layerContainer = getters.allLayerConfigs(state);

        return layerContainer.find(layerConf => layerConf.id === id);
    },

    /**
     * Returns the restConfig whitch matches the id.
     * @param {Object} state state of the app-store.
     * @returns {Object} the restConfig layer that matches the given id.
     */
    getRestConfigById: (state) => (id) => {
        const matchingLayer = state.restConfig.filter(layer => layer.id === id);

        return matchingLayer[0];
    },

    /**
     * Returns the zIndex for the given layerConfig. If zIndex already exists at layerConfig, it is returned.
     * @param {Object} state state of the app-store.
     * @param {String} id id of the layer
     * @returns {Number|null} the zIndex for the given layerConfig or null if layerConfig is not available
     */
    determineZIndex: (state) => (id) => {
        const layerConf = getters.layerConfigById(state)(id);

        if (layerConf) {
            if (Object.prototype.hasOwnProperty.call(layerConf, "zIndex") && typeof layerConf.zIndex === "number") {
                console.warn("Cannot determine zIndex for layer with id ", layerConf.id, ". Zindex already exists:", layerConf.zIndex);
                return layerConf.zIndex;
            }
            let maxZIndex = -1;
            const parentKey = Object.prototype.hasOwnProperty.call(layerConf, "backgroundLayer") && layerConf.backgroundLayer ? treeBackgroundsKey : treeSubjectsKey,
                configsByParentKey = getters.allLayerConfigsByParentKey(state)(parentKey).filter(config => Object.prototype.hasOwnProperty.call(config, "zIndex") && typeof config.zIndex === "number");

            if (configsByParentKey.length > 0) {
                maxZIndex = Math.max(...configsByParentKey.map(conf => conf.zIndex));
            }

            return maxZIndex + 1;
        }
        return null;
    }
};

export default getters;
