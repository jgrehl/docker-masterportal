import upperFirst from "../../shared/js/utils/upperFirst";

const moduleKeys = [
    "getFeatureInfo",
    "mouseHover",
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
                    dispatch("addAttributesToModuleState", {items: sections});
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
     * Updates attributes of nested state objects
     * @param {Object} _ vuex object
     * @param {Object} obj object to search within
     * @param {String} path searchpath for the attribute
     * @param {String|Number|Boolean} value replaceValue
     * @returns {void}
     */
    setDeepMerge (_, {obj, path, value}) {
        const props = typeof path === "string" ? path.split(".") : path;
        let i,
            n,
            updateObj = obj;

        for (i = 0, n = props.length - 1; i < n; ++i) {
            updateObj = updateObj[props[i]] = updateObj[props[i]] || {};
        }

        updateObj[props[i]] = value;
        return updateObj;
    },

    /**
     * Commit the attributes to a module state.
     * Note: Folders are run through recursively.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} payload action payload
     * @param {Object[]} payload.items the items
     * @param {String} payload.itemType type of item = module name
     * @param {String} payload.modulePath path to deep nested attribute
     * @returns {void}
     */
    addAttributesToModuleState ({commit, dispatch, rootState}, {items, itemType, modulePath}) {
        items.forEach(item => {
            if (item?.type === "folder") {
                dispatch("addAttributesToModuleState", {items: item.elements});
            }
            else {
                const modulePathInit = modulePath && itemType ? modulePath : `${upperFirst(item.type)}`;

                for (const [key, value] of Object.entries(item)) {
                    if (typeof value === "object" && !Array.isArray(value)) {
                        dispatch("addAttributesToModuleState", {items: [value], itemType: item?.type, modulePath: modulePathInit + `.${key}`});
                    }
                    else if (!itemType && !Array.isArray(value)) {
                        commit(`${upperFirst(item?.type)}/set${upperFirst(key)}`, value);
                    }
                    else {
                        dispatch("setDeepMerge", {obj: rootState.Modules, path: modulePathInit + `.${key}`, value: value});
                    }
                }
            }
        });
    }
};
