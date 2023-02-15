/**
 * User type definition
 * @typedef {Object} filter
 * @property {Boolean}  deactivateGFI - if true, component activation deactivates gfi component
 * @property {String}   icon - icon next to title
 * @property {String}   id - internal id of component
 * @property {String}   name - Module name
 * @property {Boolean}  renderToWindow - if true, component is rendered in a window pane instead of sidebar
 * @property {Boolean}  resizableWindow - if true and if rendered to window pane, the pane is resizable
 * @property {Array}  layers - the layer configuration for filter
 * @property {Boolean} hasMouseMapInteractions If this attribute is true, then all other modules will be deactivated when this attribute is also true. Only one module with this attribute true may be open at the same time, since conflicts can arise in the card interactions.

 */

const state = {
    icon: "bi-funnel-fill",
    id: "filter",
    type: "filter",
    name: "common:menu.filter",
    renderToWindow: false,
    resizableWindow: true,
    resetLayer: false,
    deactivateGFI: false,
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
    isInitOpen: null,
    allowMultipleQueriesPerLayer: null,
    predefinedQueries: null,
    hasMouseMapInteractions: false
};

export default state;
