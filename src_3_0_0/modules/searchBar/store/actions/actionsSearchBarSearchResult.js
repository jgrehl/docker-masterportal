import {treeSubjectsKey} from "../../../../shared/js/utils/constants";
import WKTUtil from "../../../../shared/js/utils/getWKTGeom";
import wmsGFIUtil from "../../../../shared/js/utils/getWmsFeaturesByMimeType";


/**
 * Contains actions that communicate with other components after an interaction, such as onClick or onHover, with a search result.
 */

export default {
    /**
     * Activates a layer in the topic tree.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} payload The payload.
     * @param {String} payload.layerId The layer id.
     * @returns {void}
     */
    activateLayerInTopicTree: ({dispatch}, {layerId}) => {
        dispatch("replaceByIdInLayerConfig", {
            layerConfigs: [{
                id: layerId,
                layer: {
                    id: layerId,
                    visibility: true,
                    showInLayerTree: true
                }
            }]
        }, {root: true});
    },

    /**
     * Add and activates a layer to the topic tree.
     * @param {Object} param.dispatch the dispatch
     * @param {String} payload.layerId The layer id.
     * @param {Object} payload.source The layer source.
     * @param {Object} payload The payload.
     * @returns {void}
     */
    addLayerToTopicTree: ({dispatch}, {layerId, source}) => {
        dispatch("addLayerToLayerConfig", {
            layerConfig: {...source, ...{
                id: layerId,
                showInLayerTree: true,
                type: "layer",
                visibility: true
            }},
            parentKey: treeSubjectsKey
        }, {root: true});
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
    },

    /**
     * Opens the get feature info of the search result.
     * @param {Object} payload The payload.
     * @param {Object} payload.feature The feature to show the info for.
     * @param {Object} payload.layer The layer of the feature.
     * @returns {void}
     */
    openGetFeatureInfo: ({commit}, {feature, layer}) => {
        const gfiFeature = wmsGFIUtil.createGfiFeature(
            layer,
            "",
            feature
        );

        commit("Modules/GetFeatureInfo/setGfiFeatures", [gfiFeature], {root: true});
    },

    /**
     * Sets the marker to the feature of the search result.
     * @param {Object} context actions context object.
     * @param {Object} payload The payload.
     * @param {Array} payload.coordinates The coordinates to show marker at.
     * @returns {void}
     */
    setMarker: ({dispatch}, {coordinates}) => {
        const numberCoordinates = coordinates?.map(coordinate => parseFloat(coordinate, 10));

        dispatch("Maps/placingPointMarker", numberCoordinates, {root: true});
    },

    /**
     * Zoom to the coordinates of the search result.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {Object} payload The payload.
     * @param {Array} payload.coordinates The coordinates to zoom to.
     * @returns {void}
     */
    zoomToResult: ({dispatch, getters}, {coordinates}) => {
        const numberCoordinates = coordinates?.map(coordinate => parseFloat(coordinate, 10));

        dispatch("Maps/zoomToCoordinates", {center: numberCoordinates, zoom: getters.zoomLevel}, {root: true});
    }
};
