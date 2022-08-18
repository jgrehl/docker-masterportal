/**
 * User type definition
 * @typedef {Object} app-storeState
 * @property {Object} configJs The config.js data.
 * @property {Object} portalConfig The portal configuration.
 * @property {Object} restConf The rest-services.json data.
 * @property {Object[]} layerConfig The layer configuration.
 * @property {Object} loadedConfigs The loaded configs.
 */
const state = {
    configJs: null,
    portalConfig: null,
    restConfig: null,
    layerConfig: [],
    loadedConfigs: {
        configJson: false,
        restServicesJson: false,
        servicesJson: false
    },
    portalConfigDefaults: {
        tree: {
            validLayerTypesDefaultTree: ["WMS", "SENSORTHINGS", "TERRAIN3D", "TILESET3D", "OBLIQUE"]
        }
    }
};

export default state;
