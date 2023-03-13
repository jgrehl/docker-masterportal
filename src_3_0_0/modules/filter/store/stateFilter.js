/**
 * User type definition
 * @typedef {Object} filter
 * @property {String}   icon - icon next to title
 * @property {String}   id - internal id of component
 * @property {String}   name - Module name
 * @property {Array}  layers - the layer configuration for filter
 * @property {Boolean} hasMouseMapInteractions If this attribute is true, then all other modules will be deactivated when this attribute is also true. Only one module with this attribute true may be open at the same time, since conflicts can arise in the card interactions.

 */

const state = {
    icon: "bi-funnel-fill",
    id: "filter",
    type: "filter",
    side: "mainMenu",
    name: "common:menu.filter",
    resetLayer: false,
    layerSelectorVisible: true,
    multiLayerSelector: true,
    liveZoomToFeatures: true,
    geometrySelectorOptions: false,
    minScale: 5000,
    saveTo: "void",
    layers: [],
    layerGroups: [],
    rulesOfFilters: [],
    serializedString: "",
    selectedAccordions: [],
    filtersHits: [],
    filterGeometry: false,
    geometryFeature: undefined,
    jumpToId: undefined,
    isGeneric: null,
    allowMultipleQueriesPerLayer: null,
    predefinedQueries: null,
    hasMouseMapInteractions: false
};

export default state;
