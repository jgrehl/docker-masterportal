/**
 * User type definition
 * @typedef {Object} OpenConfigState
 * @property {String} description The description that should be shown in the button in the right menu.
 * @property {String} icon Icon next to title (config-param)
 * @property {String} name Displayed as title (config-param)
 * @property {Boolean} showDescription If true, description will be shown.
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 * @property {String} type The type of the module.
 */
const state = {
    description: "",
    icon: "bi-upload",
    name: "common:menu.tools.openConfig",
    showDescription: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    type: "openConfig"
};

export default state;
