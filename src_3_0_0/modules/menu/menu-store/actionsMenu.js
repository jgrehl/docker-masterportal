import {nextTick} from "vue";
import upperFirst from "../../../shared/js/utils/upperFirst";

export default {
    /**
     * Activates menu navigation for an external module.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {Object} payload The payload.
     * @param {String} payload.side The menu side to reset.
     * @param {Object} payload.module The module type.
     * @returns {void}
     */
    activateMenuNavigation ({commit, dispatch, getters}, {side, module}) {
        if (module.type) {
            const moduleIndex = getters[side].sections[0].findIndex(sectionModule => {
                return sectionModule.type === module.type;
            });

            commit("Menu/Navigation/addEntry", [side, "sections", 0, moduleIndex], {root: true});
            dispatch("setActiveModuleMouseMapInteractions", {type: module.type, isActive: true});
        }
    },

    /**
     * Deactivates menu elements except the given module.
     * @param {Object} param store context
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {Object} payload The payload.
     * @param {String} payload.side The menu side to reset.
     * @param {Object} payload.module The module type.
     * @returns {void}
     */
    deactivateMenuElements ({dispatch, getters}, {side, module}) {
        getters[side].sections.forEach(section => {
            section.forEach(sectionModule => {
                if (sectionModule.type !== module.type && sectionModule.type !== "folder") {
                    dispatch("setElementActive", {
                        moduleNamespace: upperFirst(sectionModule.type),
                        isActive: false
                    });
                }
            });
        });
    },

    /**
     * Action triggered when a menu element has been clicked.
     * Add an entry to the navigation and, when the element
     * was a Folder, focus the first child-element, otherwise,
     * call the setActive action / mutation of the element.
     * @param {Object} context Vuex context object.
     * @param {Array} path Path leading up to the clicked menu element.
     * @returns {void}
     */
    clickedMenuElement ({commit, dispatch, getters}, path) {
        const {type} = getters.section(path);

        if (type) {
            commit("Menu/Navigation/addEntry", path, {root: true});
            if (type === "folder") {
                nextTick(() => {
                    document.getElementById(`menu-offcanvas-body-items-element-0-${path[0]}`)?.focus();
                });
                return;
            }
            nextTick(() => {
                dispatch("setElementActive", {moduleNamespace: upperFirst(type), isActive: true});
            });
            return;
        }

        console.error("Menu: A menu entry is missing the required value \"type\".");
    },

    /**
     * Merge the menu state.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @param {Object} payLoad The payload.
     * @param {Object} payLoad.mainMenu The main menu setting.
     * @param {Object} payLoad.secondaryMenu The secondary menu setting.
     * @returns {void}
     */
    mergeMenuState ({commit, state}, {mainMenu, secondaryMenu}) {
        commit("setMainMenu", Object.assign(state.mainMenu, mainMenu));
        commit("setSecondaryMenu", Object.assign(state.secondaryMenu, secondaryMenu));
        commit("Navigation/setEntries", {
            mainMenu: [],
            secondaryMenu: []
        });
    },

    /**
     * Resets one side of menu and deactivate modules.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} payload The payload.
     * @param {String} payload.side The menu side to reset.
     * @param {Object} payload.module The module type.
     * @returns {void}
     */
    resetMenu ({commit, dispatch}, {side, module}) {
        commit("Navigation/setEntry", side);
        dispatch("deactivateMenuElements", {side, module});
    },

    /**
     * Activates the module with the given namespace.
     * If it utilizes an action for activation, that is dispatched.
     * Otherwise, commit the mutation.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} payload Object containing the payload.
     * @param {String} payload.moduleNamespace Namespace of the module which should be activated.
     * @param {Boolean} payload.isActive Whether the module should be activated or deactivated.
     * @returns {void}
     */
    setElementActive ({commit, dispatch}, {moduleNamespace, isActive}) {
        const setActiveName = `Modules/${moduleNamespace}/setActive`;

        dispatch("setActiveModuleMouseMapInteractions", {type: moduleNamespace, isActive: isActive});

        if (Object.keys(this._actions).includes(setActiveName)) {
            dispatch(setActiveName, isActive, {root: true});
        }
        else {
            commit(setActiveName, isActive, {root: true});
        }
    },

    /**
     *
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @param {Object} param.rootGetters the rootGetters
     * @param {Object} payload Object containing the payload.
     * @param {String} payload.type The module type.
     * @param {Boolean} payload.isActive Whether the module should be activated or deactivated.
     * @returns {void}
     */
    setActiveModuleMouseMapInteractions ({commit, state, rootGetters}, {type, isActive}) {
        if (rootGetters[`Modules/${upperFirst(type)}/hasMouseMapInteractions`]) {
            if (isActive && upperFirst(type) !== state.activeModuleMouseMapInteractions) {
                commit("Navigation/setEntry", "mainMenu");
                commit("Navigation/setEntry", "secondaryMenu");
                commit(`Modules/${state.activeModuleMouseMapInteractions}/setActive`, false, {root: true});
                commit("setActiveModuleMouseMapInteractions", upperFirst(type));
            }
            else if (!isActive && upperFirst(type) === state.activeModuleMouseMapInteractions) {
                commit("setActiveModuleMouseMapInteractions", "GetFeatureInfo");
            }
        }
    }
};
