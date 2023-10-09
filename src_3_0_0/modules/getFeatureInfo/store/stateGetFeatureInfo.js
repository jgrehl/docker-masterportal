/**
 * User type definition
 * @typedef {Object} GetFeatureInfoState
 * @property {String[]} configPaths Path array of possible config locations. First one found will be used
 * @property {Boolean} hasMouseMapInteractions If this attribute is true, then all other modules will be deactivated when this attribute is also true. Only one module with this attribute true may be open at the same time, since conflicts can arise in the card interactions.
 * @property {String} icon Icon next to title (config-param).
 * @property {String} menuSide Specifies in which menu the GFI should be rendered
 * @property {String} name Displayed as title (config-param).
 * @property {String} type The type of the gfi component.
 * @property {Boolean} visible True if the gfi is visible.
 *
 * @property {Boolean} centerMapToClickPoint specifies if the map should be centered when clicking on a feature.
 * @property {Object} currentFeature The current feature that is displayed.
 * @property {Object[]} gfiFeatures temporary array for features at click has to be moved to gfi module.
 * @property {Object[]} path Path for menu navigation
 * @property {Boolean} [hideMapMarkerOnVectorHighlight=false] if true, mapmarker is hidden on vector highlighting.
 * @property {Object} coloredHighlighting3D The Highlight Setting of 3D Tiles.
 */
const state = {
    configPaths: ["portalConfig.getFeatureInfo"],
    hasMouseMapInteractions: true,
    icon: "bi-info-circle-fill",
    menuSide: "secondaryMenu",
    name: "common:modules.getFeatureInfo.name",
    type: "getFeatureInfo",
    visible: false,

    centerMapToClickPoint: false,
    currentFeature: null,
    currentPosition: null,
    currentRotation: null,
    gfiFeatures: [],
    hideMapMarkerOnVectorHighlight: false,
    highlightVectorRules: null,
    path: [],
    showMarker: true,
    coloredHighlighting3D: {}
};

export default state;
