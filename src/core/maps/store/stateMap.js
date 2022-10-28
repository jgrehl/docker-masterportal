/**
* @property {String} backgroundImage BackgroundImage of the map.
* @property {Number} changeZoomLevel Last zoom level before switching to another map mode.
* @property {Number[]} clickCoordinate Current coordinates where the mouse click event was triggered.
* @property {Number[]} clickPixel Current pixel values where the mouse click event was triggered.
* @property {Number[]} clickCartesianCoordinate Current cartesian 2D coordinate.
* @property {Number[]} extent Current extent values of the map.
* @property {Number} initialResolution Initial resolution value of the map.
* @property {String[]} layerIds Current layers of the map by Id.
* @property {String[]} highlightedFeatures list of highlighted features, indices correspond to "highlightedFeaturesStyles"
* @property {String[]} highlightedFeatureStyles list of original styles for highlighted features, indices correspond to "highlightedFeatures"
* @property {String[]} loadedLayers list of ready loaded layers IDs
* @property {Number[]} mouseCoordinate Current mouse coordinate values of the map.
* @property {String[]} overlayIds Current overlays of the map by Id.
* @property {String} projection Current projection name of the map.
* @property {Number[]} resolutions Available resolution values of the map.
* @property {Number} rotation Current rotation value of the map.
* @property {Number} size Current size in pixels of the map in the DOM.
* @property {Boolean} twoFingerPanStart Indicator if the 2-Fingers-Pan is active.
*/

const state = {
    backgroundImage: null,
    // boundingBox: null,
    // center: null,
    changeZoomLevel: {
        "2D": null,
        "3D": 7
    },
    clickCoordinate: null,
    clickPixel: null,
    clickCartesianCoordinate: null,
    extent: null,
    // initialCenter: null,
    initialResolution: null,
    // initialZoomLevel: null,
    layerIds: [],
    highlightedFeatures: [],
    highlightedFeatureStyles: [],
    loadedLayers: [],
    // maxZoomLevel: null,
    // minZoomLevel: null,
    // mode: "2D",
    // mouseCoordinate: null,
    overlayIds: null,
    // projection: null,
    // resolution: null,
    resolutions: null,
    // rotation: null,
    // scale: null,
    size: null,
    // zoom: null,
    twoFingerPanStart: false
};

export default state;
