import actionsMapsAttributesMapper from "./actionsMapsAttributesMapper.js";
import actionsMapsInteractions from "./actionsMapsInteractions.js";
import actionsMapsLayers from "./actionsMapsLayers.js";
import actionsMapsMapMode from "./actionsMapsMapMode.js";
// import * as highlightFeature from "./highlightFeature.js";
import * as removeHighlightFeature from "./removeHighlighting.js";

/**
 * Actions with the Map and MapView.
 */
export default {
    ...actionsMapsAttributesMapper,
    ...actionsMapsInteractions,
    ...actionsMapsLayers,
    ...actionsMapsMapMode,
    // ...highlightFeature,
    ...removeHighlightFeature
};
