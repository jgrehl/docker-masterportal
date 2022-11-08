/**
 * User type definition
 * @typedef {Object} ShareViewState
 * @property {Boolean} active if true, ShareView will rendered
 * @property {String} id id of the ShareView component
 * @property {String} icon icon next to title (config-param)
 * @property {String} name displayed as title (config-param)
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 * @property {String} type The type of the module.
 */
const state = {
    active: false,
    id: "shareView",
    icon: "bi-share",
    name: "common:menu.tools.shareView",
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    type: "shareView"
};

export default state;
