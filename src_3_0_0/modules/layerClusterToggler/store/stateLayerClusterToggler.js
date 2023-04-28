/**
 * User type definition
 * @typedef {Object} LayerClusterTogglerState
 * @property {Boolean} active If true, component is rendered
 * @property {String} description The descritption that should be shown in the button in the menu.
 * @property {String} icon Icon next to title
 * @property {String} name Module name
 * @property {Boolean} showDescription If true, description will be shown.
 * @property {String} type The type of component
 *
 * @property {Boolean} isToggled Specifies whether all layers of the layerIdList should be switched on or off.
 * @property {String[]} layerIdList A list of layer ids to activate/deactivate with one single click
 */

export default {
    active: false,
    description: "",
    icon: "bi-list",
    name: "common:modules.layerClusterToggler.name",
    showDescription: false,
    type: "layerClusterToggler",

    isToggled: true,
    layerIdList: []
};
