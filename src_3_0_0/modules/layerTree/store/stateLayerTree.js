/**
 * Menu state definition.
 * @typedef {Object} LayerTreeState
 * @property {Boolean} mainMenu.expanded Specifies whether the main menu is opened.
 */
export default {
    active: true,
    type: "layerTree",
    icon: "bi-question-circle",
    name: "LayerTree",
    alwaysActivated: true,
    isVisibleInMenu: false,
    menuSide: "mainMenu",
    showLayerSelection: false
};
