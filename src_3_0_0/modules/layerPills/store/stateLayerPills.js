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
 * @property {Number} elementsPositionedOverMapWidth the width of the elements-positioned-over-map DOM element
 * @property {Number} layerPillsListWidth the total width of layer-pills DOM element
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
    elementsPositionedOverMapWidth: 0,
    layerPillsListWidth: 0
};

export default state;
