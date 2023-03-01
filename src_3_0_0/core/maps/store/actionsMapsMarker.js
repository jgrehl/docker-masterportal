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
     * @param {String[]} value The array with the markable coordinate pair.
     * @param {Boolean} [value.keepPreviousMarker] whether function should keep or erase previously drawn markers
     * @returns {void}
     */
    placingPointMarker ({dispatch, rootGetters}, value) {
        let coordValues = [];

        if (!value.keepPreviousMarker) {
            dispatch("removePointMarker");
        }

        if (rootGetters["Maps/mode"] === "3D") {
            // else an error is thrown in proj4/lib/checkSanity: coordinates must be finite numbers
            value.forEach(val => {
                coordValues.push(Math.round(val));
            });

            // tilt the camera to recognize the mapMarker
            mapCollection.getMap("3D").getCamera().tilt_ = -200;
        }
        else {
            coordValues = value;
        }

        const layerId = "marker_point_layer",
            feature = new Feature({
                geometry: new Point(coordValues)
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
