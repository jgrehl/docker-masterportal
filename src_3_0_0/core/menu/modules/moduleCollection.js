import upperFirst from "../../../utils/upperFirst";
import store from "../../../app-store";

/**
 * The imported module stores.
 */
import indexScaleSwitcher from "./scaleSwitcher/store/indexScaleSwitcher";

/**
 * The imported module components.
 */
import ScaleSwitcher from "./scaleSwitcher/components/ScaleSwitcher.vue";

const moduleStores = {
        ScaleSwitcher: indexScaleSwitcher
    },
    moduleComponents = {
        scaleSwitcher: ScaleSwitcher
    },
    moduleComponentsConfigured = {
        navigationMain: [],
        navigationSecondary: []
    };

export default {
    /**
     * Adds the modules that are configured in the config.json to moduleComponentsConfigured and registers its stores.
     * @param {String} navigationName The navigation name.
     * @param {Object} [moduleConfigs={}] The module configs of the navigation.
     * @returns {void}
     */
    registerConfiguredModules (navigationName, moduleConfigs = {}) {
        Object.keys(moduleConfigs).forEach(moduleKey => {
            const module = moduleComponents[moduleKey],
                modulename = upperFirst(moduleKey),
                moduleStore = moduleStores[modulename];

            if (module) {
                moduleComponentsConfigured[navigationName].push(module);
            }
            if (moduleStore) {
                Object.assign(moduleStore.state, moduleConfigs[moduleKey]);
                store.registerModule(["Modules", modulename], moduleStore);
            }
        });
    },

    /**
     * Adds a module to moduleComponents.
     * @param {Object} module The module to be added.
     * @returns {void}
     */
    addModule (module) {
        moduleComponents[module.name.charAt(0).toLowerCase() + module.name.slice(1)] = module;
    },

    /**
     * Adds a module store to moduleStores.
     * @param {String} moduleName The module component name.
     * @param {Object} moduleStore The module store to be added.
     * @returns {void}
     */
    addModuleStore (moduleName, moduleStore) {
        moduleStores[moduleName] = moduleStore;
    },

    /**
     * Gets the configured module components by navigation name.
     * @param {String} navigationName The navigation name.
     * @returns {Object} The configured module components.
     */
    getConfiguredModuleComponentsByNavigation (navigationName) {
        return moduleComponentsConfigured[navigationName];
    },

    /**
     * Gets the module components.
     * @returns {Object} The module components.
     */
    getModuleComponents () {
        return moduleComponents;
    },

    /**
     * Gets the module stores.
     * @returns {Object} The module stores.
     */
    getModuleStores () {
        return moduleStores;
    }
};
