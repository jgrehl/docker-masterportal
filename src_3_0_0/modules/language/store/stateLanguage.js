/**
 * User type definition
 * @typedef {Object} languageState
 * @property {String} currentLocale - the current language code
 *
 */
const state = {
    currentLocale: "",
    type: "language",
    active: false,
    description: "",
    icon: "bi-flag",
    name: "common:menu.tools.language"
};

export default state;
