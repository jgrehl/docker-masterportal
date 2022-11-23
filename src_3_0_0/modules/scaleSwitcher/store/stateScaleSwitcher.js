/**
 * User type definition
 * @typedef {Object} ScaleSwitcherState
 * @property {Boolean} active If true, scaleSwitcher will rendered.
 * @property {Boolean} hasMouseMapInteractions If this attribute is true, then all other modules will be deactivated when this attribute is also true. Only one module with this attribute true may be open at the same time, since conflicts can arise in the card interactions.
 * @property {String} icon Icon next to title (config-param)
 * @property {String} name Displayed as title (config-param)
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 * @property {String} type The type of the module.
 *
 */
const state = {
    active: false,
    hasMouseMapInteractions: false,
    icon: "bi-arrows-angle-contract",
    name: "common:menu.tools.scaleSwitcher",
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    type: "scaleSwitcher"
};

export default state;
