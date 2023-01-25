import {nextTick} from "vue";
import upperFirst from "../../../shared/js/utils/upperFirst";

export default {
    /**
     * Action triggered when a menu element has been clicked.
     * Add an entry to the navigation and, when the element
     * was a Folder, focus the first child-element, otherwise,
     * call the setActive action / mutation of the element.
     * @param {Object} context Vuex context object.
     * @param {Array} side Path leading up to the clicked menu element.
     * @param {Object} type Properties of the element.
     * @returns {void}
     */
    clickedMenuElement ({commit, dispatch}, {name, path, side, type}) {

        if (type) {
            if (type === "folder") {
                nextTick(() => {
                    commit("setCurrentComponent", {type: type, side: side, props: {path: path, name: name}});
                });
            }
            else {
                commit("setCurrentComponent", {type: type, side: side, props: {name: name}});
                nextTick(() => {
                    dispatch("setElementActive", {moduleNamespace: type, isActive: true, side: side});
                });
            }
        }
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
        // why that?
        // commit("setEntries", {
        //     mainMenu: {
        //         component: "root",
        //         last: "notne",
        //         history: []
        //     },
        //     secondaryMenu: {
        //         component: "root",
        //         last: "none",
        //         history: []
        //     }
        // });
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
        const upperName = moduleNamespace.charAt(0).toUpperCase() + moduleNamespace.slice(1),
            setActiveName = `Modules/${upperName}/setActive`;


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
                commit(`Modules/${state.activeModuleMouseMapInteractions}/setActive`, false, {root: true});
                commit("setActiveModuleMouseMapInteractions", upperFirst(type));
            }
            else if (!isActive && upperFirst(type) === state.activeModuleMouseMapInteractions) {
                commit("setActiveModuleMouseMapInteractions", "GetFeatureInfo");
            }
        }
    },

    /**
     * Properly deactivates an element if it is not a folder
     * and removes its entry from the navigation.
     * @param {Object} context Vuex context object.
     * @param {String} side Side on which the navigation action occurred.
     * @returns {void}
     */
    navigateBack ({commit, state, dispatch, getters}, side) {
        const current = getters[side].navigation.currentComponent.type;

        if (current !== "folder") {
            dispatch("setElementActive", {moduleNamespace: current, isActive: false, side: side});
        }
        nextTick(() => {
            commit("switchToPreviousComponent", side);

            nextTick(() => {
                const props = state[side].navigation.currentComponent.props;

                if (typeof props?.navigateBackCommits === "object") {
                    Object.entries(props.navigateBackCommits).forEach(([key, value]) => {
                        commit(key, value, {root: true});
                    });
                }
            });
        });
    }
};
