/**
 * User type definition
 * @typedef {Object} StartModuleState
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 */
const state = {
    mainMenu: [],
    secondaryMenu: [],
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"]
};

export default state;
