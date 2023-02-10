import actionsMapsAttributesMapper from "./actionsMapsAttributesMapper.js";
import actionsMapsInteractions from "./actionsMapsInteractions.js";
import actionsMapsLayers from "./actionsMapsLayers.js";
import actionsMapsMapMode from "./actionsMapsMapMode.js";
import actionsMapsMarker from "./actionsMapsMarker.js";
import * as highlightFeature from "../js/highlightFeature.js";
import * as removeHighlightFeature from "../js/removeHighlighting.js";

/**
 * Actions with the Map and MapView.
 */
export default {
    ...actionsMapsAttributesMapper,
    ...actionsMapsInteractions,
    ...actionsMapsLayers,
    ...actionsMapsMapMode,
    ...actionsMapsMarker,
    ...highlightFeature,
    ...removeHighlightFeature,

    urlParams ({dispatch, rootState}, paramsString) {
        const params = JSON.parse(paramsString);

        dispatch("setView", {
            center: params.center,
            rotation: params.rotation,
            zoom: params.zoom
        });

        if (params.mode && mapCollection.getMap(params.mode)) {
            dispatch("changeMapMode", params.mode);
        }
        else {
            rootState.configJs.startingMap3D = true;
        }
    }
};
