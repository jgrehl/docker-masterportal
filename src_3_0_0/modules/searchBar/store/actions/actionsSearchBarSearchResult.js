import WKTUtil from "../../../../shared/js/utils/getWKTGeom";
/**
 * Contains actions that communicate with other components after an interaction, such as onClick or onHover, with a search result.
 */

export default {
    /**
     * Activate the layer of the search result in topic tree.
     * @returns {void}
     */
    activateLayerInTopicTree: () => {
        // Do someThing

        /* used in:
            elasticSearch
            topicTree
        */
    },

    /**
     * Adds the layer from the search result to topic tree.
     * @returns {void}
     */
    addLayerToTopicTree: () => {
        // Do someThing

        /* used in:
            elasticSearch
        */
    },

    /**
     * Highlight feature of the search result.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} payload The payload.
     * @param {Object} payload.hit The search result, must contain properties 'coordinate' as Array and 'geometryType'.
     * @returns {void}
     */
    highligtFeature: ({dispatch}, {hit}) => {
        const feature = WKTUtil.getWKTGeom(hit);

        dispatch("MapMarker/placingPolygonMarker", feature, {root: true});

        /* used in:
            specialWFS
        */
    },

    /**
     * Opens the get feature info of the search result.
     * @returns {void}
     */
    openGetFeatureInfo: () => {
        // Do someThing

        /* used in:
            visibleVector
        */
    },

    /**
     * Opens the topic tree and scroll to layer of the search result.
     * @returns {void}
     */
    openTopicTree: () => {
        // Do someThing

        /* used in:
            elasticSearch
            topicTree
        */
    },

    /**
     * Sets the marker to the feature of the search result.
     * @param {Object} context actions context object.
     * @param {Event} coordinates - the position
     * @returns {void}
     */
    setMarker: ({dispatch}, coordinates) => {
        dispatch("Maps/placingPointMarker", [parseFloat(coordinates[0]), parseFloat(coordinates[1])], {root: true});
        /* used in:
            bkg
            gazetter
            komootPhoton
            locationFinder
            osmNominatim
            specialWFS
            visibleVector
        */
    },

    /**
     * Zoom to the coordinates of the search result.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {Object} payload The payload.
     * @param {Object} payload.coordinates The coordinates to zoom to.
     * @returns {void}
     */
    zoomToResult: ({dispatch, getters}, {coordinates}) => {
        dispatch("Maps/zoomToCoordinates", {coordinates, zoom: getters.zoomLevel}, {root: true});

        /* used in:
            bkg
            gazetter
            komootPhoton
            locationFinder
            osmNominatim
            specialWFS
            visibleVector
        */
    }
};
