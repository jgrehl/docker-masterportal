import PortalTitle from "./portalTitle/components/PortalTitle.vue";
/**
 * User type definition
 * @typedef {Object} menu
 * @property {Object} componentMap Maps config.json menu key to component.
 */

export default {
    componentMap: {
        // @Todo(rullkoma): Remove portalTitle here, it is already rendered in the menu head
        portalTitle: PortalTitle
    }
};
