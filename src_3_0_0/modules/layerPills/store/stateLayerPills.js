/**
 * User type definition
 * @property {String[]} supportedDevices devices on which the module is displayed.
 * @property {String[]} supportedMapModes map mode in which this module can be used.
 * @property {Object} visibleSubjectDataLayer contains all visible subjectdata layers.
 * @property {Number} startIndex start index of shown layer pills from visibleSubjectDataLayer.
 * @property {Number} endIndex end index of shown layer pills from visibleSubjectDataLayer.
 * @property {Number} layerPillsAmount number of visible layerpills, as configured in config.json.
 * @property {Boolean} leftScrollVisibility if true, scroll through layerpills to the left is visible.
 * @property {Boolean} rightScrollVisibility if true, scroll through layerpills to the right is visible.
 * @property {Number} masterportalContainerWidth the width of the masterportal-container DOM element
 * @property {Number} mainMenuWidth the width of the menu DOM element
 * @property {Number} secondaryMenuWidth the width of the secondary-menu DOM element
 * @property {Number} layerPillsListWidth the total width of layer-pills DOM element
 * @property {Number} availableSpace the available width for the layer-pills
 */

const state = {
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],
    visibleSubjectDataLayers: [],
    startIndex: 0,
    endIndex: 0,
    layerPillsAmount: Infinity,
    leftScrollVisibility: true,
    rightScrollVisibility: true,
    masterportalContainerWidth: 0,
    mainMenuWidth: 0,
    secondaryMenuWidth: 0,
    layerPillsListWidth: 0,
    availableSpace: 0
};

export default state;
