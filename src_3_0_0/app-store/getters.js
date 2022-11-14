import {generateSimpleGetters} from "../shared/js/utils/generators";
import getNestedValues from "../shared/js/utils/getNestedValues";
import {getLayerTypes3d} from "../core/layers/js/layerFactory";
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
     * Returns all subject data layers of layerConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object[]} The layers.
     */
    allSubjectDataLayerConfigs: state => {
        return getNestedValues(state.layerConfig.Fachdaten, "Layer", "Ordner").flat(Infinity);
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
        return state.portalConfig?.controls || {};
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
     * Returns the mainmenu of portalConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object} Main menu.
     */
    mainMenuFromConfig: state => {
        return state.portalConfig.mainMenu || {};
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
     * Returns the secondaryMenu of portalConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object} Secondary menu.
     */
    secondaryMenuFromConfig: state => {
        return state.portalConfig.secondaryMenu || {};
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
     * Returns the layer configuration with the given id.
     * @param {Object} state state of the app-store.
     * @param {String} ide id of the layer
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
     * Returns all layer configurations to show in tree, if mode is 3D, else returns only 2d-layer configurations.
     * Filteres by attribute 'showInLayerTree'.
     * @param {Object} state state of the app-store.
     * @param {String} mode the mode of the map
     * @returns {Object[]} all layer configurations, if mode is 3D, else returns only 2d-layer configurations.
     */
    inTreeVisibleLayerConfigsByMode: (state) => (mode) => {
        const layerContainer = getters.allLayerConfigs(state),
            layerTypes3d = getLayerTypes3d();

        return layerContainer.filter(layer => {
            return layer.showInLayerTree !== false && (mode === "2D" ? !layerTypes3d.includes(layer.typ.toUpperCase()) : true);
        });
    }
};

export default getters;
