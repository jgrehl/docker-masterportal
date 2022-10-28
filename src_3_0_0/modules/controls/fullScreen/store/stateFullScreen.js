/**
 * User type definition
 * @typedef {Object} FullScreenState
 * @property {String} iconArrow Icon of the fullscreen arrow button.
 * @property {String} iconExit Icon of the fullscreen exit button.
 * @property {String[]} supportedDevice Devices on which the module is displayed.
 * @property {String[]} supportedMapMode Map mode in which this module can be used.
 */
const state = {
    iconArrow: "arrows-fullscreen",
    iconExit: "fullscreen-exit",
    supportedDevice: ["Desktop"],
    supportedMapMode: ["2D", "3D"]
};

export default state;
