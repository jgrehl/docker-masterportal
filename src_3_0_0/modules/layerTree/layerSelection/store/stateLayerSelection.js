/**
 * Menu state definition.
 * @typedef {Object} LayerTreeState
 * @property {Boolean} mainMenu.expanded Specifies whether the main menu is opened.
 */
export default {
    active: false,
    type: "layerSelection",
    icon: "bi-question-circle",
    isVisibleInMenu: false,
    menuSide: "mainMenu",
    name: "common:tree.addSubject",

    subjectDataLayerConfs: [],
    backgroundLayerConfs: [],
    layersToAdd: []
};
