import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import {treeSubjectsKey} from "../../../../../src_3_0_0/shared/js/utils/constants";

/**
 * Contains actions that are directly related to the components resultList and resultListItem.
 */

export default {
    /**
     * Changes layer attributes to show in layertree
     * @param {Object} param.dispatch the dispatch
     * @param {Object} searchResult a single search result
     * @returns {void}
     */
    addSingleSearchResult: ({dispatch}, searchResult) => {
        const rawLayer = rawLayerList.getLayerWhere({id: searchResult.id});

        if (rawLayer) {
            rawLayer.visibility = true;
            rawLayer.type = "layer";
            rawLayer.showInLayerTree = true;
            dispatch("addLayerToLayerConfig", {layerConfig: rawLayer, parentKey: treeSubjectsKey}, {root: true});
        }
    },
    /**
     * Adds a layer to the topic tree and triggers to close the search
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.commit the commit
     * @param {Object} searchResult a single search result
     * @returns {void}
     */
    addSingleSearchResultToTopicTree: ({dispatch, commit}, searchResult) => {
        dispatch("addSingleSearchResult", searchResult);
        commit("setSearchResultsActive", false);
    },
    /**
     * Loops the selected layers and add it to the topic tree and triggers to close the search
     * @param {Object} param.getters the getters
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.commit the commit
     * @param {Object} searchResult a single search result
     * @returns {void}
     */
    addSelectedSearchResultToTopicTree: ({getters, dispatch, commit}) => {
        const selectedSearchResults = getters.selectedSearchResults;

        if (selectedSearchResults && selectedSearchResults.length > 0) {
            for (const i in selectedSearchResults) {
                dispatch("addSingleSearchResult", selectedSearchResults[i]);
            }

            commit("setShowAllResults", false);
            commit("setSearchResultsActive", false);
            commit("setSelectedSearchResults", []);

        }
    }
};
