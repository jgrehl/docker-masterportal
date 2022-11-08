/**
 * User type definition
 * @typedef {Object} OpenConfigState
 * @property {Boolean} active If true, scaleSwitcher will rendered.
 * @property {String} icon Icon next to title (config-param)
 * @property {String} name Displayed as title (config-param)
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 * @property {String} type The type of the module.
 */
const state = {
    active: false,
    icon: "bi-upload",
    name: "common:menu.tools.openConfig",
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    type: "openConfig"
};

export default state;
