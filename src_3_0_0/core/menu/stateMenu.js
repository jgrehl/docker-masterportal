import Folder from "./folder/components/MenuFolder.vue";
import ScaleSwitcher from "./modules/scaleSwitcher/components/ScaleSwitcher.vue";

/**
 * Object mapping keys to renderable components.
 * @typedef {Object} ComponentMap
 * @type {Object}
 * @property {Vue.Component} folder Folder component.
 * @property {Vue.Component} scaleSwitcher Component of the ScaleSwitcher Tool.
 */

/**
 * Menu state definition.
 * @typedef {Object} MenuState
 * @type {Object}
 * @property {ComponentMap} componentMap Maps config.json menu key to component.
 */

export default {
    componentMap: {
        folder: Folder,
        scaleSwitcher: ScaleSwitcher
    }
};
