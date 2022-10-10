import {generateSimpleGetters} from "../../../app-store/utils/generators.js";
import {getStateAsUrlParams} from "../../../utils/parametricUrl/stateToUrlWriter";
import shareViewState from "./stateShareView";

const getters = {
    ...generateSimpleGetters(shareViewState),

    /**
     * @param {Object} __ saveSelection store state.
     * @param {Object} _ saveSelection store getters.
     * @param {Object} rootState root state.
     * @param {Object} rootGetters root getters.
     * @returns {String} The Url that can be copied by the user.
     */
    url (__, _, rootState, rootGetters) {
        return getStateAsUrlParams(rootState, rootGetters);
    }
};

export default getters;
