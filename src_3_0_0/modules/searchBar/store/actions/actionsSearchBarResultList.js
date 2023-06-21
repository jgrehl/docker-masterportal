import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import {treeSubjectsKey} from "../../../../../src_3_0_0/shared/js/utils/constants";
/**
 * Contains actions that are directly related to the components resultList and resultListItem.
 */

export default {
    /**
     * Adds a layer to the topic tree and triggers to close the search
     * @param {Object} searchResult a single search result
     * @returns {void}
     */
    addSearchResultToTopicTree: ({dispatch, commit}, searchResult) => {
        const rawLayer = rawLayerList.getLayerWhere({id: searchResult.id});

        if (rawLayer) {
            rawLayer.visibility = true;
            rawLayer.type = "layer";
            rawLayer.showInLayerTree = true;
            dispatch("addLayerToLayerConfig", {layerConfig: rawLayer, parentKey: treeSubjectsKey}, {root: true});
        }

        commit("setSearchResultsActive", false, {root: true});
    }
};
