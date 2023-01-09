/**
 * User type definition
 * @typedef {Object} languageState
 * @property {String} currentLocale - the current language code
 * @property {String} type type of the module
 * @property {Boolean} active if true, language module will rendered
 * @property {String} description The description that should be shown
 * @property {Boolean} showDescription If true, description will be shown.
 * @property {String} icon icon of the module
 * @property {String} name name of the module
 *
 */
const state = {
    currentLocale: "",
    type: "language",
    active: false,
    description: "",
    showDescription: false,
    icon: "bi-flag",
    name: "common:menu.tools.language"
};

export default state;
