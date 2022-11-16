/**
 * User type definition
 * @typedef {Object} AddWMSState
 * @property {Boolean} active if true, AddWMS will rendered
 * @property {String} id id of the AddWMS component
 * @property {String} name displayed as title (config-param)
 * @property {String} icon icon next to title (config-param)
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 * @property {String[]} supportedTreeTypes Tree type in which this module is displayed.
 * @property {Boolean} wmsUrl the wms url.
 * @property {Boolean} version the version of wms layer.
 */
const state = {
    active: false,
    type: "addWMS",
    name: "common:menu.tools.addWms",
    icon: "bi-plus-lg",
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    supportedTreeTypes: ["light"],
    wmsUrl: "",
    version: ""
};

export default state;
