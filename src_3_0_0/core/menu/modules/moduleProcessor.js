import moduleCollection from "./moduleCollection";

const configPaths = {
    navigationMain: "navigationMain.sections",
    navigationSecondary: "navigationSecondary.sections"
};

/**
 * Starts the processing of the configured modules.
 * @param {Object} portalConfig The portal configuration.
 * @returns {void}
 */
export default function initializeModules (portalConfig) {
    Object.keys(configPaths).forEach(navigationName => {
        let moduleConfigs = portalConfig;

        if (portalConfig[navigationName]) {
            configPaths[navigationName].split(".").forEach(pathPart => {
                moduleConfigs = moduleConfigs[pathPart];
            });
            moduleCollection.registerConfiguredModules(navigationName, moduleConfigs);
        }
    });
}
