/**
 * Menu state definition.
 * @typedef {Object} LayerTreeState
 * @property {Boolean} mainMenu.expanded Specifies whether the main menu is opened.
 */
export default {
    active: false,
    type: "layerSelection",
    icon: "bi-question-circle",
    name: "LayerSelection",
    alwaysActivated: true,
    isVisibleInMenu: false,
    menuSide: "mainMenu",

    subjectDataLayerConfs: [],
    layersToAdd: [],
    layersToRemove: []
};
