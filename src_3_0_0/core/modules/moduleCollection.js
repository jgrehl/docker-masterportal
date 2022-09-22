
import store from "../../app-store";

/**
 * The imported module stores.
 */
import indexScaleSwitcher from "../../modules/scaleSwitcher/store/indexScaleSwitcher";

/**
 * The imported module components.
 */
import ScaleSwitcher from "../../modules/scaleSwitcher/components/scaleSwitcher.vue";

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
     * @param {Object} moduleConfigs The module configs of the navigation.
     * @returns {void}
     */
    registerConfiguredModules (navigationName, moduleConfigs = []) {
        moduleConfigs.forEach(moduleConfig => {
            Object.keys(moduleConfig).forEach(moduleKey => {
                const module = moduleComponents[moduleKey],
                    modulename = moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1),
                    moduleStore = moduleStores[modulename];

                if (module) {
                    moduleComponentsConfigured[navigationName].push(module);
                }
                if (moduleStore) {
                    store.registerModule(["Modules", modulename], moduleStore);
                }
            });
        });

        console.log(moduleComponentsConfigured);
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
    }
};
