import menuState from "./stateMenu";
import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import {badPathSymbol, idx} from "../../../shared/js/utils/idx";

const menuGetters = {
    ...generateSimpleGetters(menuState),
    /**
     * @param {MenuState} state Local vuex state.
     * @param {Object} getters Local vuex getters.
     * @param {Object} rootState vuex rootState.
     * @returns {(function(side: String): Object)} Function returning component identified via componentMap.
     */
    componentFromPath: (state, getters, rootState) => side => {
        if (["mainMenu", "secondaryMenu"].includes(side)) {
            return rootState.Modules.componentMap[getters.objectFromPath(side, "last").type];
        }
        console.error(`Menu.componentMap: The given menu side ${side} is not allowed. Please use "mainMenu" or "secondaryMenu" instead.`);
        return null;
    },
    /**
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} __ Local vuex getters (discarded).
     * @param {Object} ___ Root state (discarded).
     * @param {Object} rootGetters Root getters.
     * @returns {(Object|null)} The configuration of the mainMenu or null.
     */
    mainMenu (_, __, ___, rootGetters) {
        if (rootGetters.loadedConfigs.configJson) {
            return rootGetters.portalConfig.mainMenu;
        }
        return null;
    },
    /**
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} getters Local vuex getters.
     * @returns {Boolean} Whether the mainMenu should be initially open.
     */
    mainInitiallyOpen (_, getters) {
        return getters.mainMenu && typeof getters.mainMenu.initiallyOpen === "boolean" ? getters.mainMenu.initiallyOpen : false;
    },
    /**
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} getters Local vuex getters.
     * @returns {(Object|null)} Title of the mainMenu or null.
     */
    mainTitle (_, getters) {
        return getters.mainMenu && typeof getters.mainMenu?.title === "object" ? getters.mainMenu.title : null;
    },
    /**
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} getters Local vuex getters.
     * @returns {string} Icon used for button toggling the mainMenu.
     */
    mainToggleButtonIcon (_, getters) {
        if (getters.mainMenu?.toggleButtonIcon?.startsWith("bi-")) {
            return getters.mainMenu.toggleButtonIcon;
        }

        return "bi-list";
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
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} __ Local vuex getters (discarded).
     * @param {Object} ___ Root state (discarded).
     * @param {Object} rootGetters Root getters.
     * @returns {(Object|null)} The configuration of the secondaryMenu or null.
     */
    secondaryMenu (_, __, ___, rootGetters) {
        if (rootGetters.loadedConfigs.configJson) {
            return rootGetters.portalConfig.secondaryMenu;
        }
        return null;
    },
    /**
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} getters Local vuex getters.
     * @returns {Boolean} Whether the secondaryMenu should be initially open.
     */
    secondaryInitiallyOpen (_, getters) {
        return getters.secondaryMenu && typeof getters.secondaryMenu.initiallyOpen === "boolean" ? getters.secondaryMenu.initiallyOpen : false;
    },
    /**
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} getters Local vuex getters.
     * @returns {(Object|null)} Title of the secondaryMenu or null.
     */
    secondaryTitle (_, getters) {
        return getters.secondaryMenu && typeof getters.secondaryMenu.title === "object" ? getters.secondaryMenu.title : null;
    },
    /**
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} getters Local vuex getters.
     * @returns {string} Icon used for button toggling the secondaryMenu.
     */
    secondaryToggleButtonIcon (_, getters) {
        if (getters.secondaryMenu?.toggleButtonIcon?.startsWith("bi-")) {
            return getters.secondaryMenu.toggleButtonIcon;
        }

        return "bi-tools";
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
     * @param {MenuState} _ Local vuex state (discarded).
     * @param {Object} getters Local vuex getters.
     * @returns {(function(path: Array): Object|null)} Function returning a section of the menu.
     */
    section: (_, getters) => path => {
        if (getters[path[0]]) {
            const section = idx(getters, path);

            if (section === badPathSymbol) {
                console.error(`Menu.getters.section: ${badPathSymbol.description} ${path}.`);
                return null;
            }
            return section;
        }
        console.error(`Menu: The given menu ${path[0]} is not configured in the config.json.`);
        return null;
    }
};

export default menuGetters;
