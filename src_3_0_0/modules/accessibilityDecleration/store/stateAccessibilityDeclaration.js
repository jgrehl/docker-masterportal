/**
 * User type definition
 * @module modules/About/state
 * @typedef {Object} aboutState
 * @property {String} description The description that should be shown in the button in the menu.
 * @property {String} icon Icon next to name (config-param).
 * @property {String} name name of this module
 * @property {Object[]} menuSide Specifies in which menu the about should be rendered
 * @property {String} type the type of layer information
 *
 */
export default {
    description: "common:modules.accessibilityDeclaration.description",
    icon: "bi-universal-access",
    name: "common:modules.accessibilityDeclaration.name",
    menuSide: "mainMenu",
    type: "accessibilityDeclaration"
};
