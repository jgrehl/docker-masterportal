import {generateSimpleGetters} from "../shared/js/utils/generators";
import getNestedValues from "../shared/js/utils/getNestedValues";
import searchInTree from "../shared/js/utils/searchInTree";
import {sortObjects} from "../shared/js/utils/sortObjects";
import stateAppStore from "./state";
import {treeBaselayersKey, treeSubjectsKey} from "../shared/js/utils/constants";

/**
 * The root getters.
 * @module app-store/getters
 */
const getters = {
    ...generateSimpleGetters(stateAppStore),

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
     * Returns all categories defined in config.json.
     * @param {Object} state state of the app-store.
     * @returns {Array} all categories defined in config.json
     */
    allCategories: (state) => {
        return state.portalConfig?.tree?.categories;
    },


    /**
     * Returns whether all configs were loaded.
     * @param {Object} state state of the app-store.
     * @returns {Boolean} True, if all configs are loaded.
     */
    allConfigsLoaded: state => {
        return Object.values(state.loadedConfigs).every(value => value === true);
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
     * Returns all folders in the layerConfig.
     * @param {Object} state state of the app-store.
     * @returns {Array} all folders in the layerConfig
     */
    allFolders: state => {
        return searchInTree(state.layerConfig[treeSubjectsKey], "elements", "type", "folder");
    },

    /**
     * Returns a folder by id.
     * @param {Object} state state of the app-store.
     * @returns {Object} a folder by id
     */
    folderById: (state) => (id) => {
        const folders = getters.allFolders(state);

        return folders.find(folder => folder.id === id);
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
     * Returns all subject data layers of layerConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} The layers.
     */
    allSubjectDataLayerConfigs: state => {
        return getters.allLayerConfigsByParentKey(state)(treeSubjectsKey);
    },
    /**
     * Returns all baselayers of layerConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} The layers.
     */
    allBaselayerConfigs: state => {
        return getters.allLayerConfigsByParentKey(state)(treeBaselayersKey);
    },

    /**
     * Returns path to the cesium library.
     * @param {Object} state state of the app-store.
     * @returns {String} The cesium library path.
     */
    cesiumLibrary: state => {
        return state.configJs?.cesiumLibrary || "https://cesium.com/downloads/cesiumjs/releases/1.107/Build/Cesium/Cesium.js";
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
     * Returns the content of all menu sections and of controls startModule menu entries.
     * @param {Object} state state of the app-store.
     * @returns {Array} configs of all modules in sections and controls
     */
    configuredModules: state => {
        let content = [];

        getters.menuFromConfig(state)("mainMenu").sections?.forEach(subSections => {
            content = content.concat(subSections);
        });
        getters.menuFromConfig(state)("secondaryMenu").sections?.forEach(subSections => {
            content = content.concat(subSections);
        });
        if (getters.controlsConfig(state).startModule?.mainMenu) {
            content = content.concat(getters.controlsConfig(state).startModule.mainMenu);
        }
        if (getters.controlsConfig(state).startModule?.secondaryMenu) {
            content = content.concat(getters.controlsConfig(state).startModule.secondaryMenu);
        }
        return content;
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
                return layerConf.zIndex;
            }
            let maxZIndex = -1;
            const parentKey = Object.prototype.hasOwnProperty.call(layerConf, "baselayer") && layerConf.baselayer ? treeBaselayersKey : treeSubjectsKey,
                configsByParentKey = getters.allLayerConfigsByParentKey(state)(parentKey).filter(config => Object.prototype.hasOwnProperty.call(config, "zIndex") && typeof config.zIndex === "number");

            if (configsByParentKey.length > 0) {
                maxZIndex = Math.max(...configsByParentKey.map(conf => conf.zIndex));
            }

            return maxZIndex + 1;
        }
        return null;
    },

    /**
     * Gets the value to an url parameter.
     * @param {Object} state state of the app-store.
     * @param {String} param The url parameter.
     * @returns {String} The value to the given url parameter.
     */
    getUrlParamValue: state => param => {
        return state.urlParams[param.toUpperCase()];
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
     * Returns the layer is a baselayer or not
     * @param {Object} state state of the app-store.
     * @returns {Boolean} Is baselayer.
     */
    isBaselayer: state => layerId => {
        const layerConfig = getters.allLayerConfigs(state).find(layerConf => layerConf.id === layerId);

        return Boolean(layerConfig.baselayer);
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
     * Returns the layer configs for url params.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} The layerConfigs for url params.
     */
    layerUrlParams: state => {
        const layers = getters.layerConfigsByAttributes(state)({showInLayerTree: true}),
            layerParams = [];

        sortObjects(layers, "zIndex");
        layers.forEach(layer => {
            const param = {
                id: layer.id,
                visibility: layer.visibility
            };

            if (layer.transparency) {
                param.transparency = layer.transparency;
            }

            layerParams.push(param);
        });

        return layerParams || [];
    },

    /**
     * Returns the menu of portalConfig by side.
     * @param {Object} state state of the app-store.
     * @returns {Object} Main menu.
     */
    menuFromConfig: state => side => {
        return state.portalConfig[side] || {};
    },

    /**
     * Returns true, if moduleName is available in a menu.
     * @param {Object} state state of the app-store.
     * @param {String} moduleType type of the module
     * @returns {Boolean} true, if moduleName is configured in a menu.
     */
    isModuleAvailable: state => moduleType =>{
        return JSON.stringify(state.portalConfig).includes("\"type\":\"" + moduleType + "\"");
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
     * Returns the named projections from config.js.
     * @param {Object} state state of the app-store.
     * @returns {Array}  the named projections from config.js
     */
    namedProjections: state => state?.configJs.namedProjections || null,

    /**
     * Returns proxyHost if given.
     * @param {Object} state state of the app-store.
     * @returns {String} proxhost if given or empty proxyHost
     */
    proxyHost: state => state?.configJs?.proxyHost || "",

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
     * Return the highlighted features.
     * @param {Object} state state of the app-store.
     * @returns {Object|Boolean} The highlighted features.
     */
    treeHighlightedFeatures: state => {
        return state?.portalConfig?.tree?.highlightedFeatures || false;
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
     * Returns all visible subject data layer configurations.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} Containing all layer configurations with property 'visibility' is true.
     */
    visibleSubjectDataLayerConfigs: (state) => {
        const layerContainer = getters.allSubjectDataLayerConfigs(state);

        return layerContainer.filter(layerConf => layerConf.visibility === true);
    },

    /**
     * Returns all visible baselayer configurations.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} The layers with property 'visibility' is not true.
     */
    visibleBaselayerConfigs: (state) => {
        const layerContainer = getters.allBaselayerConfigs(state);

        return layerContainer.filter(layerConf => layerConf.visibility === true);
    },

    /**
     * Returns all not visible baselayer configurations.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} The layers.
     */
    invisibleBaselayerConfigs: (state) => {
        const layerContainer = getters.allBaselayerConfigs(state);

        return layerContainer.filter(layerConf => layerConf.visibility !== true);
    }
};

export default getters;
