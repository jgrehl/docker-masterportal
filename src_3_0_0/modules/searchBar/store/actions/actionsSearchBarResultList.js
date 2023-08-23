/**
 * Contains actions that are directly related to the components resultList and resultListItem.
 */
export default {
    /**
     * Activate click action(s) of searchResult.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} searchResult The search result.
     * @param {String} actionType The action type onHover or onClick.
     * @returns {void}
     */
    activateAction ({dispatch}, {searchResult, actionType}) {
        const events = searchResult.events[actionType] || {};

        Object.keys(events).forEach(event => {
            dispatch(event, events[event]);
        });
    }
};
