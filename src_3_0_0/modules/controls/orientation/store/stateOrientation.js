/**
 * User type definition
 * @typedef {Object} FreezeState
 * @property {String} iconGeolocate Icon of the orientation geolocate button.
 * @property {String} iconGeolocatePOI Icon of the orientation geolocate POI button.
 * @property {String[]} poiDistances The distances in config.json.
 * @property {String[]} supportedDevice Devices on which the module is displayed.
 * @property {String[]} supportedMapMode Map mode in which this module can be used.
 * @property {String} zoomMode The zoomMode in config.json.
 */
const state = {
    iconGeolocate: "geo-alt-fill",
    iconGeolocatePOI: "record-circle",
    poiDistances: [],
    supportedDevice: ["Desktop"],
    supportedMapMode: ["2D", "3D"],
    zoomMode: "once",

    activeCategory: "",
    geolocation: null,
    poiMode: "currentPosition",
    poiModeCurrentPositionEnabled: true,
    position: null,
    showPoi: false,
    showPoiChoice: false,
    showPoiIcon: false
};

export default state;

