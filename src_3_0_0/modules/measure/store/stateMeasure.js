import VectorLayer from "ol/layer/Vector.js";

import style from "../js/measureStyle";
import source from "../js/measureSource";

/**
 * Measure tool state definition.
 * @typedef {object} MeasureState
 * @property {boolean} active if true, Measure will rendered
 * @property {string} name displayed as title (config-param)
 * @property {Boolean} hasMouseMapInteractions If this attribute is true, then all other modules will be deactivated when this attribute is also true. Only one module with this attribute true may be open at the same time, since conflicts can arise in the card interactions.
 * @property {string} icon icon next to title (config-param)
 * @property {number} earthRadius earth radius to assume for length/area calculations (config-param)
 * @property {string} measurementAccuracy indicates how accurately the measurement result is displayed for m and m².
 *                                        Options are "decimeter" for one decimal place. "meter" for no decimal place.
 *                                        And "dynamic" for one decimal place for results smaller 10m / 10m² and
 *                                        no decimal place for results greater or equal 10m / 10m²
 * @property {object<String, module:ol/Feature>} lines line features by ol_uid
 * @property {object<String, module:ol/Feature>} polygons polygon features by ol_uid
 * @property {string[]} geometryValues Available geometry values for measurement selection
 * @property {string[]} geometryValues3d Available geometry values for measurement selection in 3D mode
 * @property {string[]} lineStringUnits Available units for line measurement
 * @property {string[]} polygonUnits Available units for polygon measurement
 * @property {string} selectedGeometry Selected geometry value for measurement
 * @property {string} selectedUnit Selected unit by stringified index ("0"/"1"). Index allows smoother
 *                                 changes between measurement systems. E.g. when switching from 2D polygon measuring
 *                                 to 3D line measuring, the unit stays in kilos, in this example km² to km.
 * @property {function[]} unlisteners unlisten methods to execute before source clear
 * @property {(module:ol/Interaction|MeasureDraw3d)} interaction current interaction on map or 3d model, if any
 * @property {module:ol/vector/Source} source draw layer source
 * @property {module:ol/vector/Layer} layer draw layer
 * @property {string} featureId ol_uid of the current feature
 * @property {number[]} tooltipCoord coordinates to show the tooltip at
 */
const state = {
    active: false,
    // defaults for config.json tool parameters
    description: "",
    name: "common:menu.tools.measure",
    hasMouseMapInteractions: true,
    icon: "bi-arrows-angle-expand",
    showDescription: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D"],
    type: "measure",

    // tool-specific config.json parameters
    earthRadius: 6378137,
    measurementAccuracy: "meter",

    // measure form state and UI
    lines: {},
    polygons: {},
    geometryValues: ["LineString", "Polygon"],
    lineStringUnits: ["m", "km"],
    polygonUnits: ["m²", "km²"],
    selectedGeometry: "LineString",
    selectedUnit: "0",
    unlisteners: [],
    isDrawing: false,

    // measure layer and ol
    interaction: null,
    source,
    layer: new VectorLayer({
        source,
        style,
        id: "measureLayer",
        name: "measureLayer",
        alwaysOnTop: true
    }),
    featureId: null,
    tooltipCoord: []
};

export default state;
