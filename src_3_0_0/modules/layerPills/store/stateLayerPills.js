/**
 * User type definition
 * @property {String[]} supportedDevices devices on which the module is displayed.
 * @property {String[]} supportedMapModes map mode in which this module can be used.
 * @property {Object} visibleSubjectDataLayer contains all visible subjectdata layers.
 * @property {Boolean} active status of layerpills, as configured in config.json.
 * @property {Number} amount number of visible layerpills, as configured in config.json.
 */

const state = {
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    visibleSubjectDataLayers: [],
    active: false,
    amount: 3
};

export default state;
