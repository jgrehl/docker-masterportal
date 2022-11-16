/**
 * User type definition
 * @typedef {Object} GetFeatureInfoState
 * @property {String} type The type of the gfi component.
 * @property {String} name Displayed as title (config-param).
 * @property {String} icon Icon next to title (config-param).
 * @property {Boolean} active True if the gfi is active.
 * @property {Object} currentFeature The current feature that is displayed.
 * @property {String} desktopType Specifies which template is used in desktop mode.
 * @property {Boolean} centerMapToClickPoint specifies if the map should be centered when clicking on a feature.
 * @property {Object[]} gfiFeatures temporary array for features at click has to be moved to gfi module.
 *
 */
const state = {
    type: "getFaetureInfo",
    name: "common:menu.tools.getInfos",
    icon: "bi-info-circle-fill",
    active: false,
    currentFeature: null,
    desktopType: "",
    centerMapToClickPoint: false,
    showMarker: true,
    highlightVectorRules: null,
    currentPosition: null,
    currentRotation: null,
    gfiFeatures: []
};

export default state;
