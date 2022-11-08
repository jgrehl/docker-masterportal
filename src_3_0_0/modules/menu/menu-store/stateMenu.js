/**
 * Menu state definition.
 * @typedef {Object} MenuState
 * @property {Object} mainMenu the main menu settings.
 * @property {Boolean} mainMenu.initiallyOpen Specifies whether the main menu should be opened initially.
 * @property {Object[]} mainMenu.sections The main menu sections.
 * @property {Object} mainMenu.title The main menu title.
 * @property {String} mainMenu.toggleButtonIcon The main menu toggle button icon.
 * @property {Object} secondaryMenu the secondary menu settings.
 * @property {Boolean} secondaryMenu.initiallyOpen Specifies whether the secondary menu should be opened initially.
 * @property {Object[]} secondaryMenu.sections The secondary menu sections.
 * @property {Object} secondaryMenu.title The secondary menu title.
 * @property {String} secondaryMenu.toggleButtonIcon The secondary menu toggle button icon.
 */
export default {
    mainMenu: {
        initiallyOpen: false,
        title: null,
        toggleButtonIcon: "bi-list",
        sections: []
    },
    secondaryMenu: {
        initiallyOpen: false,
        sections: [],
        title: null,
        toggleButtonIcon: "bi-tools"
    }
};
