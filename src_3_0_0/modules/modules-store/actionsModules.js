import upperFirst from "../../shared/js/utils/upperFirst";

const moduleKeys = [
    "getFeatureInfo",
    "mainMenu.sections",
    "secondaryMenu.sections"
];

export default {
    /**
     * Merge state of modules.
     * @todo Should be revised to work generically for all modules.
     * @param {Object} param store context
     * @param {Object} param.dispatch the dispatch
     * @param {Object} portalConfig The portalConfig.
     * @returns {void}
     */
    mergeModulesState ({dispatch}, portalConfig) {
        moduleKeys.forEach(moduleKey => {
            const keys = moduleKey.split(".");

            if (keys.length === 1 && portalConfig[keys[0]]) {
                dispatch("mergeModule", {name: keys[0], config: portalConfig[keys[0]]});
            }
            else if (keys.length > 1 && portalConfig[keys[0]] && portalConfig[keys[0]][keys[1]]) {
                portalConfig[keys[0]][keys[1]].forEach(sections => {
                    dispatch("addAttributesToModuleState", sections);
                });
            }
        });
    },

    /**
     * Merge the module state.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} portalConfig todo
     * @returns {void}
     */
    mergeModule ({commit}, {name, config}) {
        Object.keys(config).forEach(key => {
            commit(`${upperFirst(name)}/set${upperFirst(key)}`, config[key]);
        });
    },

    /**
     * Commit the attributes to a module state.
     * Note: Folders are run through recursively.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object[]} items The items.
     * @returns {void}
     */
    addAttributesToModuleState ({commit, dispatch}, items) {
        Array.from(items).forEach(item => {
            if (item?.type === "folder") {
                dispatch("addAttributesToModuleState", item.elements);
            }
            else {
                for (const [key, value] of Object.entries(item)) {
                    commit(`${upperFirst(item?.type)}/set${upperFirst(key)}`, value);
                }
            }
        });
    }
};
