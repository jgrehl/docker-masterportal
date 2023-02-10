/**
 * User type definition
 * @typedef {Object} app-storeState
 * @property {Object} configJs The config.js data.
 * @property {Boolean} isMobile True is mobile device is indicated.
 * @property {Object[]} layerConfig The layer configuration.
 * @property {Object} loadedConfigs The loaded configs.
 * @property {Object} portalConfig The portal configuration.
 * @property {Object} restConf The rest-services.json data.
 * @property {Object} urlParams The url params.
 */
const state = {
    configJs: null,
    deviceMode: "Desktop",
    layerConfig: [],
    loadedConfigs: {
        configJson: false,
        restServicesJson: false,
        servicesJson: false
    },
    portalConfig: null,
    restConfig: null,
    urlParams: {}
};

export default state;
