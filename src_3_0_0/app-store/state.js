import isMobile from "../utils/isMobile";

/**
 * User type definition
 * @typedef {Object} app-storeState
 * @property {Object} configJs The config.js data.
 * @property {Boolean} isMobile True is mobile device is indicated.
 * @property {Object[]} layerConfig The layer configuration.
 * @property {Object} loadedConfigs The loaded configs.
 * @property {Object} portalConfig The portal configuration.
 * @property {Object} restConf The rest-services.json data.
 */
const state = {
    configJs: null,
    isMobile: isMobile(),
    layerConfig: [],
    loadedConfigs: {
        configJson: false,
        restServicesJson: false,
        servicesJson: false
    },
    portalConfig: null,
    restConfig: null
};

export default state;
