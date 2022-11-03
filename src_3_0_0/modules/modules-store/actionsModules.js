import upperFirst from "../../shared/js/utils/upperFirst";

const moduleKeys = [
    "mainMenu",
    "secondaryMenu"
];

export default {
    /**
     * Merge state of modules.
     * @param {Object} param store context
     * @param {Object} param.dispatch the dispatch
     * @param {Object} portalConfig The portalConfig.
     * @returns {void}
     */
    mergeModuleState ({dispatch}, portalConfig) {
        moduleKeys.forEach(moduleKey => {
            portalConfig[moduleKey]?.sections.forEach(sections => {
                dispatch("addAttributesToModuleState", sections);
            });
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
        items.forEach(item => {
            if (item?.itemType === "folder") {
                dispatch("addAttributesToModuleState", item.children);
            }
            else {
                for (const [key, value] of Object.entries(item)) {
                    commit(`${upperFirst(item?.itemType)}/set${upperFirst(key)}`, value);
                }
            }
        });
    }
};
