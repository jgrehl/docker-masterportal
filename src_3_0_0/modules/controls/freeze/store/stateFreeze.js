/**
 * User type definition
 * @typedef {Object} FreezeState
 * @property {String} icon Icon of the freeze button.
 * @property {String[]} supportedDevice Devices on which the module is displayed.
 * @property {String[]} supportedMapMode Map mode in which this module can be used.
 */
const state = {
    icon: "lock-fill",
    supportedDevice: ["Desktop"],
    supportedMapMode: ["2D", "3D"]
};

export default state;
