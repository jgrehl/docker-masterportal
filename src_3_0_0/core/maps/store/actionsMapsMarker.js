import Feature from "ol/Feature.js";
import {nextTick} from "vue";
import Point from "ol/geom/Point.js";

import mapMarker from "../js/mapMarker";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList";
import createStyle from "@masterportal/masterportalapi/src/vectorStyle/createStyle";

/**
 * Place and remove map markers as point or polygon.
 */
export default {
    /**
     * Change the styleId for the marker with the given markerId.
     * @param {Object} context the context Vue instance
     * @param {String} markerId The map marker id.
     * @param {String} styleId The style id.
     * @returns {void}
     */
    changeMarkerStyle (context, {markerId, styleId}) {
        mapMarker.getMapmarkerLayerById(markerId)?.set("styleId", styleId || "defaultMapMarkerPoint");
    },

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
     * @param {String[]|Object} position The array with the markable coordinate pair or an Object wird coordinates and rotation.
     * @param {String[]} [position.coordinates] The array with the coordinates.
     * @param {Number} [position.rotation] The rotation in degree.
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

        dispatch("removePointMarker");

        if (coordinates) {
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
    },

    /**
     * Rotates the point marker.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.state the state
     * @param {ol/Feature} feature The map marker feature.
     * @param {Object} position The Object wird coordinates and rotation.
     * @param {String[]} position.coordinates The array with the coordinates.
     * @param {Number} position.rotation The rotation in degree.
     * @returns {void}
     */
    rotatePointMarker ({dispatch, state}, {feature, position}) {
        feature.getStyle()?.getImage()?.setRotation(position.rotation * Math.PI / 180);

        nextTick(() => {
            if (state.mode === "3D") {
                dispatch("rotatePointMarkerIn3D", position);
            }
        });
    },

    /**
     * Rotates the point marker in 3D.
     * @param {Object} param.rootGetters the rootGetters
     * @param {Object} position The Object wird coordinates and rotation.
     * @param {String[]} position.coordinates The array with the coordinates.
     * @param {Number} position.rotation The rotation in degree.
     * @returns {void}
     */
    rotatePointMarkerIn3D ({rootGetters}, position) {
        const clickPixel = rootGetters["Maps/clickPixel"],
            angle = position.rotation;
        let pixelOffset;

        if (clickPixel) {
            mapCollection.getMap("3D").getCesiumScene().drillPick({x: clickPixel[0], y: clickPixel[1]}, 100, 200, 200).forEach(primitiveObject => {
                if (primitiveObject?.primitive?.olLayer?.get("id") === "marker_point_layer") {
                    switch (angle) {
                        case 0: {
                            pixelOffset = {
                                x: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.width - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0]) * primitiveObject.primitive.scale))) / 2,
                                y: -((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.height - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1]) * primitiveObject.primitive.scale))) / 2
                            };
                            break;
                        }
                        case 90: {
                            pixelOffset = {
                                x: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.height - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1]) * primitiveObject.primitive.scale))) / 2,
                                y: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.width - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0]) * primitiveObject.primitive.scale))) / 2
                            };
                            break;
                        }
                        case 180: {
                            pixelOffset = {
                                x: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.width - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0]) * primitiveObject.primitive.scale))) / 2,
                                y: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.height - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1]) * primitiveObject.primitive.scale))) / 2
                            };
                            break;
                        }
                        case 270: {
                            pixelOffset = {
                                x: -((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.height - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1]) * primitiveObject.primitive.scale))) / 2,
                                y: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.width - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0]) * primitiveObject.primitive.scale))) / 2
                            };
                            break;
                        }
                        default: {
                            break;
                        }
                    }

                    primitiveObject.primitive.pixelOffset = pixelOffset;
                    primitiveObject.primitive.rotation = -angle * Math.PI / 180;
                }
            });
        }
    }
};
