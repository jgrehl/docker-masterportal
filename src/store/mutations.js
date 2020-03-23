/**
 * Returns an object in which the Config parameters are assigned to the modules.
 * @returns {object} contains Config parameters to Moudles.
 */
function getConfigToStateModules () {
    return {
        Alerting: "alerting",
        Title: "portalTitle",
        ScaleLine: "scaleLine"
    };
}

/**
 * For objects, the first level is traversed and the values are added to the store.
 * For all other values such as strings and arrays, the values are added directly to the store.
 * Triggers the parsing for each available module one after the other
 * @param {object} state - Vuex store.
 * @param {object} [Config={}] - Data from config.js or config.json.
 * @param {object} [configToStateModulesParameters={}] - Contains Config parameters to Moudles.
 * @returns {void}
 */
function parseConfigToStore (state, Config = {}, configToStateModulesParameters = {}) {
    Object.keys(configToStateModulesParameters).forEach(stateModule => {
        const configParameter = configToStateModulesParameters[stateModule];

        parseConfigParameters(state, Config, configParameter, stateModule);
    });
}

/**
 * Adds the data from the Config to the Vuex Store.
 * Objects that have a parameter "children" will be searched at a deeper level.
 * @param {object} state - Vuex store.
 * @param {object} [Config={}] - Data from config.js or config.json.
 * @param {string} configParameter - Parameter assigned to a module in the Config.
 * @param {string} stateModule - Module to which a config parameter is to be assigned.
 * @returns {void}
 */
function parseConfigParameters (state, Config = {}, configParameter, stateModule) {
    if (Config.hasOwnProperty(configParameter)) {
        addConfigParametersToState(state, Config, configParameter, stateModule);
    }
    else if (typeof Config === "object") {
        Object.values(Config).forEach(configChild => {
            if (configChild.hasOwnProperty("children")) {
                parseConfigParameters(state, configChild.children, configParameter, stateModule);
            }
        });
    }
}

/**
 * Adds the parameters of the Config to the Vuex store.
 * For objects, each attribute is added individually.
 * @param {object} state - Vuex store.
 * @param {object} [Config={}] - Data from config.js or config.json.
 * @param {string} configParameter - Parameter assigned to a module in the Config.
 * @param {string} stateModule - Module to which a config parameter is to be assigned.
 * @returns {void}
 */
function addConfigParametersToState (state, Config = {}, configParameter, stateModule) {
    const configParameterFromConfig = Config[configParameter];

    if (typeof configParameterFromConfig === "object") {
        Object.keys(configParameterFromConfig).forEach(configParameterValue => {
            state[stateModule][configParameterValue] = configParameterFromConfig[configParameterValue];
        });
    }
    else {
        state[stateModule][configParameter] = configParameterFromConfig;
    }
}

export default {
    /**
     * Sets config.json.
     * @param {object} state store state
     * @param {object} config config.json
     * @returns {void}
     */
    setConfigJson (state, config) {
        state.configJson = config;
    },
    /**
     * Sets mobile flag.
     * @param {object} state store state
     * @param {boolean} mobile whether browser resolution indicates mobile device
     * @returns {void}
     */
    setMobile (state, mobile) {
        state.mobile = mobile;
    },
    /**
     * Adds the data from config.js to the vuex store.
     * @param {object} state - Vuex store.
     * @param {object} [Config={}] - data from config.js
     * @returns {void}
     */
    addConfigJsToStore (state, Config = {}) {
        parseConfigToStore(state, Config, getConfigToStateModules());
    },
    /**
     * Adds the data from config.js to the vuex store.
     * For objects, the first level is traversed and the values are added to the store.
     * For all other values such as strings and arrays, the values are added directly to the store.
     * @param {onject} state - vuex store
     * @param {object} [Config={}] - data from config.js
     * @returns {void}
     */
    addConfigToStore (state, Config = {}) {
        Object.keys(Config).forEach(configModule => {
            const vuexModule =
                configModule.charAt(0).toUpperCase() +
                configModule.slice(1);

            if (state.hasOwnProperty(vuexModule)) {
                if (typeof Config[configModule] === "object") {
                    Object.keys(Config[configModule]).forEach(value => {
                        if (state[vuexModule].hasOwnProperty(value)) {
                            state[vuexModule][value] =
                                Config[configModule][value];
                        }
                    });
                }
                else {
                    state[vuexModule][configModule] = Config[configModule];
                }
            }
        });
    },
    /**
     * Adds the data from config.json to the vuex store.
     * The parts of the Config.json are parsed individually.
     * Portaltitle is processed as an object, since this parameter is located at the highest level in the Config.
     * If the deprecated parameters "PortalTitle", "PortalLogo", "LogoLink", "LogoToolTip", "tooltip" have been defined
     * in the portal-config.json, their values and names are stored within an object.
     * @param {object} state - Vuex store.
     * @param {object} [Config={}] - Data from config.json.
     * @returns {void}
     */
    addConfigJsonToStore (state, Config = {}) {
        // portalElements deprecated in 3.0.0
        const portalElements = ["PortalTitle", "PortalLogo", "LogoLink", "LogoToolTip", "tooltip"],
            partOfConfig = {portalTitle: {}};

        Object.keys(Config).forEach(parameter => {
            if (portalElements.find(element => element === parameter) !== undefined) {
                partOfConfig.portalTitle[parameter] = Config[parameter];
            }
            else if (parameter === "portalTitle") {
                partOfConfig.portalTitle = Config[parameter];
            }
            else {
                parseConfigToStore(state, Config[parameter], getConfigToStateModules());
            }
            parseConfigToStore(state, partOfConfig, getConfigToStateModules());
        });
    },
    setToolConfig (state, payload) {
        Object.keys(state.Tools).forEach(toolId => {
            const tool = state.Tools[toolId];

            if (tool && tool.id === payload.id) {
                if (payload.name) {
                    // special handling of attribute name, is a reserved keyword in vue -> use title
                    tool.title = payload.name;
                }
                Object.assign(tool, payload);
            }
        });
    },
    setToolActive (state, payload) {
        Object.keys(state.Tools).forEach(toolId => {
            const tool = state.Tools[toolId];

            if (tool && tool.id === payload.id) {
                tool.active = payload.active;
            }
        });
    }
};
