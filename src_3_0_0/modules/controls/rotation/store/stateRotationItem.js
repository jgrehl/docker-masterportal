/**
 * User type definition
 * @typedef {Object} RotationItemState
 * @property {String} icon Icon of the rotation button.
 * @property {Boolean} showAlways Defines whether the control is shown permanently.
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 */
const state = {
    icon: "bi-cursor",
    showAlways: false,
    supportedDevices: ["Desktop"],
    supportedMapModes: ["2D", "3D"]
};

export default state;
