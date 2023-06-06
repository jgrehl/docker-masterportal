/**
 * Contains actions that are directly related to the components suggestionList and suggestionListItem.
 */

export default {
    /**
     * Returns configJson values.
     * @param {Object} rootState the rootState
     * @returns {void}
     */
    getconf: async ({rootState}) =>{
        return rootState.configJson;
    }
};
