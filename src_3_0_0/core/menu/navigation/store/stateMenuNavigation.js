/**
 * Object containing path keys for both menus.
 * @typedef {Object} NavigationEntries
 * @type {Object}
 * @property {Array<Array>} mainMenu Path keys for the mainMenu navigation.
 * @property {Array<Array>} secondaryMenu Path keys for the secondaryMenu navigation.
 */

/**
 * MenuNavigation state definition.
 * @typedef {Object} MenuNavigationState
 * @property {NavigationEntries} entries Holds path keys for the respective menus.
 */
export default {
    entries: {
        mainMenu: [],
        secondaryMenu: []
    }
};
