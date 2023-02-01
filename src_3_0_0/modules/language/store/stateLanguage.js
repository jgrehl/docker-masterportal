/**
 * User type definition
 * @typedef {Object} languageState
 * @property {String} currentLocale - the current language code
 * @property {String} type type of the module
 * @property {String} description The description that should be shown
 * @property {Boolean} showDescription If true, description will be shown.
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 * @property {String} icon icon of the module
 * @property {String} name name of the module
 *
 */
const state = {
    currentLocale: "",
    type: "language",
    description: "",
    showDescription: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    icon: "bi-flag",
    name: "common:menu.tools.language"
};

export default state;
