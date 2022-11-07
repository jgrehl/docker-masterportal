/**
 * User type definition
 * @typedef {Object} ZoomState
 * @property {String} iconIn Icon of the Zoom out button.
 * @property {String} iconOut Icon of the Zoom in button.
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 */
const state = {
    iconIn: "plus-icon",
    iconOut: "minus-icon",
    supportedDevices: ["Desktop", "Mobile"],
    supportedMapModes: ["2D"]
};

export default state;
