import store from "../../../app-store";
import highlightFeaturesByAttribute from "./highlightFeaturesByAttribute";
import processUrlParams from "../../../shared/js/utils/processUrlParams";

// Todos:
// - highlightFeature in richtige actions umbauen
// - HIGHLIGHTFEATURESBYATTRIBUTE:
//      - in richtige actions umbauen
//      - in Object umbauen
// - ZOOMTOEXTENT in object umbauen (mit Proj)

const mapUrlParams = {
        HIGHLIGHTFEATURE: highlightFeature,
        MAPS: setMapAttributes,
        ZOOMTOFEATUREID: zoomToFeatures,
        ZOOMTOGEOMETRY: zoomToFeatures
    },
    legacyMapUrlParams = {
        ALTITUDE: setCamera,
        ATTRIBUTENAME: highlightFeaturesByAttributes,
        ATTRIBUTEQUERY: highlightFeaturesByAttributes,
        ATTRIBUTEVALUE: highlightFeaturesByAttributes,
        BEZIRK: zoomToFeatures,
        CENTER: setView,
        "MAP/CENTER": setView,
        FEATUREID: zoomToFeatures,
        HEADING: setCamera,
        "MAP/HIGHLIGHTFEATURE": highlightFeature,
        HIGHLIGHTFEATURESBYATTRIBUTE: highlightFeaturesByAttributes,
        "API/HIGHLIGHTFEATURESBYATTRIBUTE": highlightFeaturesByAttributes,
        MAP: setMode,
        "MAP/MAPMODE": setMode,
        MARKER: setMapMarker,
        MAPMARKER: setMapMarker,
        PROJECTION: zoomToProjExtent,
        "MAP/PROJECTION": zoomToProjExtent,
        TILT: setCamera,
        WFSID: highlightFeaturesByAttributes,
        ZOOMLEVEL: setView,
        "MAP/ZOOMLEVEL": setView,
        ZOOMTOEXTENT: zoomToProjExtent,
        "MAP/ZOOMTOEXTENT": zoomToProjExtent,
        "MAP/ZOOMTOFEATUREID": zoomToFeatures,
        "MAP/ZOOMTOGEOMETRY": zoomToFeatures
    };

/**
 * Process the map url params.
 * @returns {void}
 */
function processMapUrlParams () {
    processUrlParams(mapUrlParams, legacyMapUrlParams);
}

/**
 * Set the map attributes.
 * @param {Object} params The found params.
 * @returns {void}
 */
function setMapAttributes (params) {
    const mapsParams = Object.fromEntries(
        Object.entries(JSON.parse(params.MAPS)).map(([k, v]) => [k.toUpperCase(), v])
    );

    setCamera(mapUrlParams);
    setMode(mapsParams);
    setView(mapsParams);
}

/**
 * Highlights a feature via layerid and featureid.
 * @param {Object} params The found params.
 * @returns {void}
 */
function highlightFeature (params) {
    store.dispatch("Maps/highlightFeature", {
        layerIdAndFeatureId: params.HIGHLIGHTFEATURE?.split(","),
        type: "viaLayerIdAndFeatureId"
    });
}

/**
 * Highlight Features by Attributes.
 * @param {Object} params The found params.
 * @returns {void}
 */
function highlightFeaturesByAttributes (params) {
    const attributeName = params.ATTRIBUTENAME,
        attributeValue = params.ATTRIBUTEVALUE,
        attributeQuery = params.ATTRIBUTEQUERY,
        wfsId = params.WFSID;

    if (attributeName && attributeValue && wfsId) {
        highlightFeaturesByAttribute.highlightFeaturesByAttribute(
            store.dispatch,
            store.getters,
            wfsId,
            attributeName,
            attributeValue,
            attributeQuery
        );
    }
    else {
        console.warn("Not all required URL parameters given for highlightFeaturesByAttribute.");
    }
}

/**
 * Sets the camera params.
 * @param {Object} params The found params.
 * @returns {void}
 */
function setCamera (params) {
    store.dispatch("Maps/setCamera", {
        altitude: params.ALTITUDE,
        heading: params.HEADING,
        tilt: params.TILT
    });
}

/**
 * Sets the map marker params.
 * @param {Object} params The found params.
 * @returns {void}
 */
function setMapMarker (params) {
    store.dispatch("Maps/placingPointMarker",
        params.MARKER?.split(",") || params.MAPMARKER?.split(",")
    );
}

/**
 * Sets the mode params.
 * @param {Object} params The found params.
 * @returns {void}
 */
function setMode (params) {
    store.dispatch("Maps/changeMapMode", (params.MODE || params.MAP || params["MAP/MAPMODE"])?.toUpperCase());
}

/**
 * Sets the view params.
 * @param {Object} params The found params.
 * @returns {void}
 */
function setView (params) {
    const center = params.CENTER || params["MAP/CENTER"];

    store.dispatch("Maps/setView", {
        center: Array.isArray(center) ? center : center?.split(","),
        rotation: params.ROTATION,
        zoom: params.ZOOM || params.ZOOMLEVEL || params["MAP/ZOOMLEVEL"]
    });
}

/**
 * Zoom to features.
 * @param {Object} params The found params.
 * @returns {void}
 */
function zoomToFeatures (params) {
    store.dispatch("Maps/zoomToFeatures", {
        ZOOMTOFEATUREID: params.FEATUREID || params.ZOOMTOFEATUREID || params["MAP/ZOOMTOFEATUREID"],
        ZOOMTOGEOMETRY: params.BEZIRK || params.ZOOMTOGEOMETRY || params["MAP/ZOOMTOGEOMETRY"]
    });
}

/**
 * Zoom on an extent, with coordinates of another projection than the map.
 * @param {Object} params The found params.
 * @returns {void}
 */
function zoomToProjExtent (params) {
    store.dispatch("Maps/zoomToProjExtent", {
        extent: (params.ZOOMTOEXTENT || params["MAP/ZOOMTOEXTENT"])?.split(","),
        options: {duration: 0},
        projection: params.PROJECTION || params["MAP/PROJECTION"]
    });
}

export default {
    processMapUrlParams
};


/**
 * Examples:
 * - https://localhost:9001/portal/master/?MAPS={%22center%22:[571278.4429867676,5938534.397334521],%22mode%22:%222D%22,%22zoom%22:7}
 * - https://localhost:9001/portal/master/?bezirk=bergedorf
 * - https://localhost:9001/portal/master/?zoomtogeometry=altona
 * - https://localhost:9001/portal/master/?zoomlevel=0
 * - https://localhost:9001/portal/master/?ZOOMTOEXTENT=10.0822,53.6458,10.1781,53.8003&PROJECTION=EPSG:4326
 */
