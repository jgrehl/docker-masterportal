import titlePortalState from "./statePortalTitle";
import {generateSimpleGetters} from "../../../../app-store/utils/generators";

const getters = {
    ...generateSimpleGetters(titlePortalState),
    /**
     * Returns the portalTitle configuration of portalConfig.
     * @param {Object} state state of the app-store.
     * @returns {Object} The controls config.
     */
    portalTitleConfig: state => {
        return state.portalConfig?.portalTitle || null;
    }
};

export default getters;
