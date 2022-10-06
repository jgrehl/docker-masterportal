import Folder from "./folder/components/MenuFolder.vue";
/**
 * Menu type definition
 * @typedef {Object} menu
 * @property {Object} componentMap Maps config.json menu key to component.
 * @property {Object} identifyComponentByProperty Maps config.json menu entries by the existence of a defined property to a component.
 * @property {Array} menuItems holds all menu items to display in the menu.
 */

export default {
    componentMap: {
    },
    identifyComponentByProperty: {
        children: Folder
    },
    menuItems: []
};
