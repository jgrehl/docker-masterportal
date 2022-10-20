import Folder from "./folder/components/MenuFolder.vue";
import ScaleSwitcher from "./modules/scaleSwitcher/components/ScaleSwitcher.vue";

/**
 * Menu type definition
 * @typedef {Object} menu
 * @property {Object} componentMap Maps config.json menu key to component.
 */

export default {
    componentMap: {
        folder: Folder,
        scaleSwitcher: ScaleSwitcher
    }
};
