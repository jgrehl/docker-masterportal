/**
 * User type definition
 * @typedef {Object} NewsViewState
 * @property {String} description The descritption that should be shown in the button in the right menu.
 * @property {String} icon The icon next to title (config-param).
 * @property {String} name The name displayed as title (config-param).
 * @property {Boolean} showDescription If true, description will be shown.
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 * @property {String} type The type of the module.
 * @property {Object[]} news The news to display.
 */
const state = {
    description: "",
    icon: "bi-newspaper",
    name: "common:menu.tools.news",
    showDescription: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    type: "news",
    news: []
};

export default state;
