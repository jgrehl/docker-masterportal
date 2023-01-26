import upperFirst from "../../../../shared/js/utils/upperFirst";

const actions = {
    /**
     * Gets the module state.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.rootState the rootState
     * @param {Object} payload The payload.
     * @param {Object[]} payload.menuModels The configured modules by menu.
     * @param {String} payload.menuSide The menu side.
     * @returns {void}
     */
    setConfiguredModuleStates ({commit, dispatch, rootState}, {menuModels, menuSide}) {
        menuModels.forEach(module => {
            if (module?.type) {
                dispatch("extendModuleState", {module, menuSide});
                commit("addConfiguredModel", {
                    menuSide: menuSide,
                    state: rootState.Modules[upperFirst(module.type)]
                });
            }
        });
    },

    /**
     * Add attributes to module state, because to show in menu.
     * @param {Object} param store context
     * @param {Object} param.rootState the rootState
     * @param {Object} payload The payload.
     * @param {Object} payload.module The module.
     * @param {String} payload.menuSide The menu side.
     * @returns {void}
     */
    extendModuleState ({rootState}, {module, menuSide}) {
        rootState.Modules[upperFirst(module.type)] = {
            ...rootState.Modules[upperFirst(module.type)],
            ...{
                isVisibleInMenu: false,
                menuSide: menuSide
            },
            ...module
        };
    },

    /**
     * Activates or deactivates the associated module of the clicked control.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} payload The payload.
     * @param {Object} payload.moduleState The vuex states the clicked module-control.
     * @param {String} payload.menuSide The menu side.
     * @returns {void}
     */
    onClick ({commit}, {moduleState, menuSide}) {
        if (!moduleState.active) {
            commit("Menu/setCurrentComponent", {type: moduleState.type, side: menuSide, props: {name: moduleState.name}}, {root: true});
        }

        commit(`Modules/${upperFirst(moduleState.type)}/setActive`, !moduleState.active, {root: true});
    }
};

export default actions;
