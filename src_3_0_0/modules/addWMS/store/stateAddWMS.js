/**
 * User type definition
 * @typedef {Object} AddWMSState
 * @property {String} description The description that should be shown in the button in the right menu.
 * @property {String} id id of the AddWMS component
 * @property {String} name displayed as title (config-param)
 * @property {String} icon icon next to title (config-param)
 * @property {Boolean} showDescription If true, description will be shown.
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 * @property {String[]} supportedTreeTypes Tree type in which this module is displayed.
 */
const state = {
    description: "",
    type: "addWMS",
    name: "common:menu.tools.addWms",
    icon: "bi-plus-lg",
    showDescription: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    supportedTreeTypes: ["light"]
};

export default state;
