import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import mapMarker from "../js/mapMarker";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList";
import createStyle from "@masterportal/masterportalapi/src/vectorStyle/createStyle";

/**
 * Place and remove map markers as point or polygon.
 */
export default {
    /**
     * With this function the coordinate, which has to be marked by the mapMarker, is written to the MapMarker state.
     * @param {String[]} value The array with the markable coordinate pair.
     * @param {Boolean} [value.keepPreviousMarker] whether function should
     *                  keep or erase previously drawn markers
     * @returns {void}
     */
    placingPointMarker ({state, rootState, commit, dispatch}, value) {
        const styleObject = styleList.returnStyleObject(state.pointStyleId);
        let coordValues = [];

        if (!value?.keepPreviousMarker) {
            dispatch("removePointMarker");
        }

        if (styleObject) {
            if (rootState.Maps.mode === "3D") {
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
            const iconfeature = new Feature({
                    geometry: new Point(coordValues)
                }),
                featureStyle = createStyle.createStyle(styleObject, iconfeature, false, Config.wfsImgPath);

            iconfeature.setStyle(featureStyle);
            iconfeature.set("styleId", state.pointStyleId);
            iconfeature.set("featureId", iconfeature.ol_uid);

            commit("addFeatureToMarker", {feature: iconfeature, marker: "markerPoint"});
            commit("setVisibilityMarker", {visibility: true, marker: "markerPoint"});
            dispatch("Maps/addLayerOnTop", state.markerPoint, {root: true});
        }
        else {
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.mapMarker.nostyleObject", {styleId: state.pointStyleId}), {root: true});
        }
    },

    /**
     * This function has the task to remove the coordinate from the mapMarker state.
     * This is necessary / triggered if the MapMarker should be removed.
     * @returns {void}
     */
    removePointMarker ({state, commit}) {
        mapMarker.removeMapMarker("marker_point_layer");
        mapCollection.getMap("2D").removeLayer(state.markerPoint);
        commit("clearMarker", "markerPoint");
        commit("setVisibilityMarker", {visbility: false, marker: "markerPoint"});
    },
    /**
     * With this function the coordinate, which has to be marked by the mapMarker, is written to the MapMarker state.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.rootGetters the rootGetters
     * @param {String[]} coordinates The array with the markable coordinate pair.
     * @returns {void}
     */
    /* placingPointMarker ({dispatch, rootGetters}, value) {
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
                geometry: new Point(coordinates)
            });

        mapMarker.addFeatureToMapMarkerLayer(layerId, feature);
    }, */

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
    /*   removePointMarker () {
        mapMarker.removeMapMarker("marker_point_layer");
    }, */

    /**
     * Removes the features from the polygon map marker.
     * @returns {void}
     */
    removePolygonMarker () {
        mapMarker.removeMapMarker("marker_polygon_layer");
    }
};
