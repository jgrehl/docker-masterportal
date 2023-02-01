/**
 * User type definition
 * @property {String[]} supportedDevices devices on which the module is displayed.
 * @property {String[]} supportedMapModes map mode in which this module can be used.
 * @property {Object} visibleSubjectDataLayer contains all visible subjectdata layers.
 * @property {Number} startIndex start index of shown layer pills from visibleSubjectDataLayer.
 * @property {Number} endIndex end index of shown layer pills from visibleSubjectDataLayer.
 * @property {Number} layerPillsAmount number of visible layerpills, as configured in config.json.
 * @property {Boolean} leftScrollDisabled if true, scroll through layerpills to the left is disabled.
 * @property {Boolean} rightScrollDisabled if true, scroll through layerpills to the right is disabled.
 */

const state = {
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    visibleSubjectDataLayers: [],
    startIndex: 0,
    endIndex: 0,
    layerPillsAmount: 0,
    leftScrollDisabled: true,
    rightScrollDisabled: true
};

export default state;
