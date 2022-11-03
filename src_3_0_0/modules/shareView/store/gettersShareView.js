import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import {getStateAsUrlParams} from "../../../shared/js/utils/stateToUrlWriter";
import shareViewState from "./stateShareView";

const getters = {
    ...generateSimpleGetters(shareViewState),

    /**
     * @param {Object} __ shareView store state.
     * @param {Object} _ shareView store getters.
     * @param {Object} rootState root state.
     * @param {Object} rootGetters root getters.
     * @returns {String} The Url that can be copied by the user.
     */
    url (__, _, rootState, rootGetters) {
        return getStateAsUrlParams(rootState, rootGetters);
    }
};

export default getters;
