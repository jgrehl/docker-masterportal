import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import mapMarker from "../js/mapMarker";

/**
 * Place and remove map markers as point or polygon.
 */
export default {
    /**
     * With this function the coordinate, which has to be marked by the mapMarker, is written to the MapMarker state.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.rootGetters the rootGetters
     * @param {String[]} coordinates The array with the markable coordinate pair.
     * @returns {void}
     */
    placingPointMarker ({dispatch}, coordinates) {
        dispatch("removePointMarker");

        const layerId = "marker_point_layer",
            feature = new Feature({
                geometry: new Point(coordinates)
            });

        mapMarker.addFeatureToMapMarkerLayer(layerId, feature);
    },

    /**
     * Adds a polygon feature to the the polygon map marker layer.
     * @param {Object} param.dispatch the dispatch
     * @param {ol/Feature} feature The ol feature that is added to the map.
     * @returns {void}
     */
    placingPolygonMarker ({dispatch}, feature) {
        const layerId = "marker_polygon_layer";

        dispatch("removePolygonMarker");
        mapMarker.addFeatureToMapMarkerLayer(layerId, feature);
    },

    /**
     * Removes the features from the point map marker.
     * @returns {void}
     */
    removePointMarker () {
        mapMarker.removeMapMarker("marker_point_layer");
    },

    /**
     * Removes the features from the polygon map marker.
     * @returns {void}
     */
    removePolygonMarker () {
        mapMarker.removeMapMarker("marker_polygon_layer");
    }
};
