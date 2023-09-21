/**
 * User type definition
 * @typedef {Object} ShareViewState
 * @property {String} description The description that should be shown in the button in the menu.
 * @property {String} id id of the ShareView component
 * @property {String} icon icon next to title (config-param)
 * @property {String} name displayed as title (config-param)
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 * @property {String} type The type of the module.
 */
const state = {
    description: "common:modules.shareView.description",
    icon: "bi-share",
    name: "common:modules.shareView.name",
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    type: "shareView"
};

export default state;
