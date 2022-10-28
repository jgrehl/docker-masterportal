/**
 * User type definition
 * @typedef {Object} Button3dState
 * @property {String} icon2d Icon of the 2D button.
 * @property {String} icon3d Icon of the 3D button.
 * @property {String[]} supportedDevice Devices on which the module is displayed.
 * @property {String[]} supportedMapMode Map mode in which this module can be used.
 */
const state = {
    icon2d: "2-square",
    icon3d: "badge-3d",
    supportedDevice: ["Desktop", "Mobile"],
    supportedMapMode: ["2D", "3D"]
};

export default state;
