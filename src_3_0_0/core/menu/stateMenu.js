import Folder from "./folder/components/MenuFolder.vue";
/**
 * User type definition
 * @typedef {Object} menu
 * @property {Object} componentMap Maps config.json menu key to component.
 */

export default {
    componentMap: {
        folder: Folder
    },
    menuItems: []
};
