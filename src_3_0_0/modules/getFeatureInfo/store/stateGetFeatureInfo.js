/**
 * User type definition
 * @typedef {Object} GetFeatureInfoState
 * @property {Boolean} active True if the gfi is active.
 * @property {Boolean} alwaysActivated This module is always activated.
 * @property {Boolean} hasMouseMapInteractions If this attribute is true, then all other modules will be deactivated when this attribute is also true. Only one module with this attribute true may be open at the same time, since conflicts can arise in the card interactions.
 * @property {String} icon Icon next to title (config-param).
 * @property {Object[]} isVisibleInMenu Specifies a whether a menu item is to be created.
 * @property {Object[]} menuSide Specifies in which menu the GFI should be rendered
 * @property {String} name Displayed as title (config-param).
 * @property {String} type The type of the gfi component.
 * @property {Boolean} centerMapToClickPoint specifies if the map should be centered when clicking on a feature.
 * @property {Object} currentFeature The current feature that is displayed.
 * @property {String} desktopType Specifies which template is used in desktop mode.
 * @property {Object[]} gfiFeatures temporary array for features at click has to be moved to gfi module.
 * @property {Object[]} path Path for menu navigation *
 */
const state = {
    active: false,
    alwaysActivated: true,
    hasMouseMapInteractions: true,
    icon: "bi-info-circle-fill",
    isVisibleInMenu: false,
    menuSide: "secondaryMenu",
    name: "common:menu.tools.getInfos",
    type: "getFeatureInfo",

    centerMapToClickPoint: false,
    currentFeature: null,
    currentPosition: null,
    currentRotation: null,
    desktopType: "",
    gfiFeatures: [],
    highlightVectorRules: null,
    path: [],
    showMarker: true
};

export default state;
