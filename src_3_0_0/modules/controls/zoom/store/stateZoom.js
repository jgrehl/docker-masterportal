/**
 * User type definition
 * @typedef {Object} ZoomState
 * @property {String} iconIn Icon of the Zoom out button.
 * @property {String} iconOut Icon of the Zoom in button.
 * @property {String[]} supportedDevice Devices on which the module is displayed.
 * @property {String[]} supportedMapMode Map mode in which this module can be used.
 */
const state = {
    iconIn: "plus-icon",
    iconOut: "minus-icon",
    supportedDevice: ["Desktop", "Mobile"],
    supportedMapMode: ["2D"]
};

export default state;
