/**
 * Contains actions that are directly related to the components suggestionList and suggestionListItem.
 */

export default {
    /**
     * Overwrite default values in search interface.
     * @param {Object} param.state the state
     * @returns {void}
     */
    getconf: async ({rootState}) =>{

        return rootState.configJson;
    }
};
