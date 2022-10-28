/**
 * User type definition
 * @typedef {Object} TotalViewState
 * @property {String} icon Icon of the TotalView button.
 * @property {String[]} supportedDevice Devices on which the module is displayed.
 * @property {String[]} supportedMapMode Map mode in which this module can be used.
 */
const state = {
    icon: "skip-backward-fill",
    supportedDevice: ["Desktop"],
    supportedMapMode: ["2D", "3D"]
};

export default state;
