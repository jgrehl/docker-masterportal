import menuState from "./stateMenu";
import {badPathSymbol, idx} from "../../../shared/js/utils/idx";
import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import upperFirst from "../../../shared/js/utils/upperFirst";

const menuGetters = {
    ...generateSimpleGetters(menuState),

    /**
     * Returns all modules with the attribute alwaysActivated: true.
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} __ Local vuex getters (discarded).
     * @param {Object} rootState vuex rootState.
     * @param {Object} rootGetters vuex rootGetters.
     * @returns {Object[]} components always activated
     */
    componentsAlwaysActivated: (_, __, rootState, rootGetters) => {
        const componentAlwaysActivated = [];

        Object.keys(rootGetters["Modules/componentMap"]).forEach(moduleKey => {
            const module = rootState.Modules[upperFirst(moduleKey)];

            if (module?.alwaysActivated) {
                componentAlwaysActivated.push({
                    module: rootGetters["Modules/componentMap"][moduleKey],
                    menuSide: module.menuSide || "secondaryMenu"
                });
            }
        });

        return componentAlwaysActivated;
    },

    /**
     * Returns, if a module with attribute hasMouseMapInteractions will be deactivated.
     * @param {MenuState} state Local vuex state.
     * @param {Object} _ Local vuex getters (discarded).
     * @param {Object} __ vuex rootState (discarded).
     * @param {Object} rootGetters vuex rootGetters.
     * @returns {(function(type: String): Boolean)} Function returning component identified via deactivateModule.
     */
    deactivateModule: (state, _, __, rootGetters) => type => {
        if (rootGetters[`Modules/${upperFirst(type)}/hasMouseMapInteractions`]
            && upperFirst(type) !== state.activeModuleMouseMapInteractions
        ) {
            return true;
        }

        return false;
    },

    /**
     * @param {Object} state Local vuex state.
     * @returns {Boolean} Whether the mainMenu is opened.
     */
    mainExpanded: state => {
        return state.mainMenu.expanded;
    },

    /**
     * @param {Object} state Local vuex state.
     * @returns {(Object|null)} Title of the mainMenu or null.
     */
    mainTitle: state => {
        return state.mainMenu.title;
    },

    /**
     * @param {Object} state Local vuex state.
     * @returns {String} Icon used for button toggling the mainMenu.
     */
    mainToggleButtonIcon: state => {
        return state.mainMenu.toggleButtonIcon;
    },

    /**
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} getters Local vuex getters.
     * @param {Object} __ Root state (discarded).
     * @param {Object} rootGetters Root getters.
     * @returns {(function(side: String, entry: String): Object)} Function returning previous added menu navigation entry or null.
     */
    objectFromPath: (_, getters, __, rootGetters) => (side, entry) => {
        if (["mainMenu", "secondaryMenu"].includes(side) && ["last", "previous"].includes(entry)) {
            // eslint-disable-next-line new-cap
            return getters.section(rootGetters[`Menu/Navigation/${entry}Entry`](side));
        }
        console.error("Menu.objectFromPath: One of the following errors occurred:");
        console.error(`Menu.objectFromPath: a) The given menu side ${side} is not allowed. Please use "mainMenu" or "secondaryMenu" instead.`);
        console.error(`Menu.objectFromPath: b) The given entry in the navigation ${entry} is not allowed. Please use "last" or "previous" instead.`);
        return null;
    },

    /**
     * @param {Object} state Local vuex state.
     * @returns {Boolean} Whether the secondaryMenu should be initially open.
     */
    secondaryExpanded: state => {
        return state.secondaryMenu.expanded;
    },

    /**
     * @param {Object} state Local vuex state.
     * @returns {(Object|null)} Title of the secondaryMenu or null.
     */
    secondaryTitle: state => {
        return state.secondaryMenu.title;
    },

    /**
     * @param {Object} state Local vuex state.
     * @returns {string} Icon used for button toggling the secondaryMenu.
     */
    secondaryToggleButtonIcon: state => {
        return state.secondaryMenu.toggleButtonIcon;
    },

    /**
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} getters Local vuex getters.
     * @returns {(function(path: Array): Object|null)} Function returning a section of the menu.
     */
    section: (_, getters) => path => {
        if (path && getters[path[0]]) {
            const section = idx(getters, path);

            if (section === badPathSymbol) {
                console.error(`Menu.getters.section: ${badPathSymbol.description} ${path}.`);
                return null;
            }
            return section;
        }

        console.error(`Menu: The given menu ${path[0]} is not configured in the config.json.`);
        return null;
    },

    /**
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} getters Local vuex getters.
     * @returns {function(side: String): {title: string, idAppendix: string}|null} Function returning an object including the title and an appendix for the titles id to make it unique; may return null if no title is configured.
     */
    titleBySide: (_, getters) => side => {
        if (side === "mainMenu" && getters.mainTitle) {
            return {...getters.mainTitle, idAppendix: side};
        }
        if (side === "secondaryMenu" && getters.secondaryTitle) {
            return {...getters.secondaryTitle, idAppendix: side};
        }
        return null;
    },
    /**
     * @param {MenuNavigationState} state Local vuex state.
     * @returns {(function(side: String): any|false)} Last entry for the given menu.
     */
    previuosNavigationEntry: state => side => {
        const previousEntry = state[side].navigation.history.slice(-1).toString();

        if (previousEntry !== "") {
            return previousEntry;
        }
        return false;
    },

    /**
     * @param {MenuNavigationState} state Local vuex state.
     * @param {string} side Menu Side
     * @returns {object} Returns the currently visible Component.
     */
    currentComponent: state => side => {
        return state[side].navigation.currentComponent;
    }
};

export default menuGetters;
