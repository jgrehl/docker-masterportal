import actionsMapsAttributesMapper from "./actionsMapsAttributesMapper.js";
import actionsMapsInteractions from "./actionsMapsInteractions.js";
import actionsMapsLayers from "./actionsMapsLayers.js";
import actionsMapsMapMode from "./actionsMapsMapMode.js";

/**
 * Actions with the Map and MapView.
 */
export default {
    ...actionsMapsAttributesMapper,
    ...actionsMapsInteractions,
    ...actionsMapsLayers,
    ...actionsMapsMapMode
};
