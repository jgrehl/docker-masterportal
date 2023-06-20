import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import {treeSubjectsKey} from "../../../../../src_3_0_0/shared/js/utils/constants";
/**
 * Contains actions that are directly related to the components resultList and resultListItem.
 */

export default {
    /**
     * Adds a layer to the topic tree and closes the search
     * @param {Object} searchResult a single search result
     * @returns {void}
     */
    addLayerToTopicTree: ({dispatch, mutation}, searchResult) => {
       //this.$store.dispatch
       console.log('--------------------------');
        const rawLayer = rawLayerList.getLayerWhere({id: searchResult.events.onClick.addLayerToTopicTree.layerId});

        if (rawLayer) {
            rawLayer.visibility = true;
            rawLayer.type = "layer";
            rawLayer.showInLayerTree = true;
            dispatch("addLayerToLayerConfig", {layerConfig: rawLayer, parentKey: treeSubjectsKey});
        }

        mutation("searchResultsActive", false);
    }
};
