import crs from "@masterportal/masterportalapi/src/crs";

import store from "../../../app-store";
import highlightFeaturesByAttribute from "./highlightFeaturesByAttribute";
import processUrlParams from "../../../shared/js/utils/processUrlParams";

/**
 * Here the urlParams for the maps are processed.
 *
 * Examples:
 * - https://localhost:9001/portal/master/?highlightfeature=1711,DE.HH.UP_GESUNDHEIT_KRANKENHAEUSER_2
 * - https://localhost:9001/portal/master/?MAPS={%22center%22:[571278.4429867676,5938534.397334521],%22mode%22:%222D%22,%22zoom%22:7}
 * - https://localhost:9001/portal/master/?MAPS={%22center%22:[571278.4429867676,5938534.397334521],%22mode%22:%223D%22,%22zoom%22:7,%22altitude%22:127,%22heading%22:-1.2502079000000208,%22tilt%22:45}
 * - https://localhost:9001/portal/master/?marker=565874,5934140
 * - https://localhost:9001/portal/master/?ZOOMTOFEATUREID=18,26
 * - https://localhost:9001/portal/master/?zoomtogeometry=bergedorf
 *
 * - https://localhost:9001/portal/master/?map=3d&altitude=127&heading=-1.2502079000000208&tilt=45
 * - https://localhost:9001/portal/master/?Map/highlightfeature=1711,DE.HH.UP_GESUNDHEIT_KRANKENHAEUSER_2
 * - https://localhost:9001/portal/master/?bezirk=bergedorf
 * - https://localhost:9001/portal/master/?center=553925,5931898
 * - https://localhost:9001/portal/master/?center=[553925,5931898]
 * - https://localhost:9001/portal/master/?Map/center=[553925,5931898]
 * - https://localhost:9001/portal/master/?highlightFeaturesByAttribute=123&wfsId=8712&attributeName=bezirk&attributeValue=Altona&attributeQuery=IsLike
 * - https://localhost:9001/portal/master/?mapMode=3d
 * - https://localhost:9001/portal/master/?MAP/MAPMODE=3d
 * - https://localhost:9001/portal/master/?MAPMARKER=[565874,%205934140]
 * - https://localhost:9001/portal/master/?Map/projection=EPSG:31467&Map/center=[3565836,5945355]
 * - https://localhost:9001/portal/master/?projection=EPSG:31467&marker=3565836,5945355
 * - https://localhost:9001/portal/master/?zoomtogeometry=altona
 * - https://localhost:9001/portal/master/?zoomlevel=0
 * - https://localhost:9001/portal/master/?ZOOMTOEXTENT=10.0822,53.6458,10.1781,53.8003&PROJECTION=EPSG:4326
 * - https://localhost:9001/portal/master/?zoomToExtent=510000,5850000,625000,6000000
 * - https://localhost:9001/portal/master/?MAP/ZOOMTOFEATUREID=18,26
 * - https://localhost:9001/portal/master/?featureid=18,26
 */

const mapUrlParams = {
        HIGHLIGHTFEATURE: highlightFeature,
        MAPS: setMapAttributes,
        MARKER: setMapMarker,
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
        MAPMODE: setMode,
        "MAP/MAPMODE": setMode,
        MAPMARKER: setMapMarker,
        PROJECTION: processProjection,
        "MAP/PROJECTION": processProjection,
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

    setCamera(mapsParams);
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
        layerIdAndFeatureId: (params.HIGHLIGHTFEATURE || params["MAP/HIGHLIGHTFEATURE"])?.split(","),
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
 * Process the param PROJECTION.
 * PROJECTION is only used in combination with one of the following parameters:
 * - CENTER, "MAP/CENTER"
 * - MARKER, MAPMARKER
 * - ZOOMTOEXTENT,"MAP/ZOOMTOEXTENT"
 * @param {Object} params The found params.
 * @returns {void}
 */
function processProjection (params) {
    if (params.CENTER || params["MAP/CENTER"]) {
        setView(params);
    }
    if (params.MARKER || params.MAPMARKER) {
        setMapMarker(params);
    }
    if (params.ZOOMTOEXTENT || params["MAP/ZOOMTOEXTENT"]) {
        zoomToProjExtent(params);
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
    const projection = params.PROJECTION || params["MAP/PROJECTION"];
    let marker = params.MARKER || params.MAPMARKER;

    if (marker && !Array.isArray(marker)) {
        if (marker.includes("[")) {
            marker = JSON.parse(marker);
        }
        else {
            marker = marker?.split(",");
        }
    }

    marker = marker?.map(coord => parseFloat(coord, 10));

    store.dispatch("Maps/placingPointMarker", projection ? crs.transformToMapProjection(mapCollection.getMap("2D"), projection, marker) : marker);
}

/**
 * Sets the mode params.
 * @param {Object} params The found params.
 * @returns {void}
 */
function setMode (params) {
    store.dispatch("Maps/changeMapMode", (params.MODE || params.MAP || params.MAPMODE || params["MAP/MAPMODE"])?.toUpperCase());
}

/**
 * Sets the view params.
 * @param {Object} params The found params.
 * @returns {void}
 */
function setView (params) {
    const projection = params.PROJECTION || params["MAP/PROJECTION"];
    let center = params.CENTER || params["MAP/CENTER"];

    if (!Array.isArray(center)) {
        if (center.includes("[")) {
            center = JSON.parse(center);
        }
        else {
            center = center?.split(",");
        }
    }

    store.dispatch("Maps/setView", {
        center: projection ? crs.transformToMapProjection(mapCollection.getMap("2D"), projection, center) : center,
        rotation: params.ROTATION,
        zoom: params.ZOOM ?? params.ZOOMLEVEL ?? params["MAP/ZOOMLEVEL"]
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
        projection: params.PROJECTION || params["MAP/PROJECTION"] || store.getters["Maps/projectionCode"]
    });
}

export default {
    processMapUrlParams,
    setMapAttributes,
    highlightFeature,
    highlightFeaturesByAttributes,
    processProjection,
    setMapMarker,
    setCamera,
    setMode,
    setView,
    zoomToFeatures,
    zoomToProjExtent
};
