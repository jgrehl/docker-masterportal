/**
 * User type definition
 * @typedef {Object} BackForwardState
 * @property {String} iconBack Icon of the backward button.
 * @property {String} iconForward Icon of the forward button.
 * @property {String[]} supportedDevice Devices on which the module is displayed.
 * @property {String[]} supportedMapMode Map mode in which this module can be used.
 * @property {Object[]} memory The memories.
 * @property {Number} position The counter of memories.
 */
const state = {
    iconBack: "skip-start-fill",
    iconForward: "skip-end-fill",
    supportedDevice: ["Desktop"],
    supportedMapMode: ["2D"],

    memory: [],
    position: null
};

export default state;
