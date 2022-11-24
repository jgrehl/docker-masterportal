/**
 * User type definition
 * @typedef {Object} RoutingState
 * @property {Boolean} active If true, routing will rendered.
 * @property {String} type The type of the module.

 * @property {String} icon Icon next to title (config-param).
 * @property {Boolean} deactivateGFI The GFI will be disabled when opening this module if the attribute is true.
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.

 * @property {String} activeRoutingToolOption Navigation Parameter which raouting mode is actived from begin.
 * @property {String[]} routingToolOptions routingToolOptions: ["DIRECTIONS", "ISOCHRONES"].
 * @property {Object} taskHandler Used to keep Track of the current process of batchProcessing.
 * @property {Object} download Download Parameter.
 * @property {Object} geosearch Routing Geosearch Parameter. // type: "NOMINATIM", serviceId: "nominatim_suche" or type: "BKG",serviceId: "bkg_geosearch".
 * @property {Object} geosearchReverse Routing GeosearchReverse Parameters.  // type: "NOMINATIM",serviceId: "nominatim_reverse"type: "BKG",serviceId: "bkg_geosearch".
 * @property {Object} directionsSettings Routing Direction Parameters. // type: "ORS",serviceId: "bkg_ors".
 * @property {Object} isochronesSettings Routing Isochrones Parameters. // type: "ORS",serviceId: "bkg_ors".
*/

const state = {
    // mandatory
    active: false,
    type: "routing",
    // mandatory defaults for config.json parameters
    name: "common:menu.tools.routing",
    icon: "bi-signpost-2-fill",
    deactivateGFI: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],

    // Navigation Parameter
    activeRoutingToolOption: "DIRECTIONS",
    routingToolOptions: [],
    taskHandler: null,
    download: {
        fileName: "",
        format: "GEOJSON"
    },
    geosearch: {
        minChars: 3,
        limit: 10,
        type: null,
        serviceId: null
    },
    geosearchReverse: {
        type: null,
        serviceId: null,
        distance: 1000,
        filter: null
    },
    directionsSettings: {
        type: null,
        serviceId: null,
        speedProfile: "CAR",
        preference: "RECOMMENDED",
        styleRoute: {
            fillColor: [255, 44, 0],
            width: 6,
            highlightColor: [255, 255, 255],
            highlightWidth: 9,
            partHighlightColor: [255, 255, 255],
            partHighlightWidth: 3
        },
        styleWaypoint: {
            lineColor: [255, 127, 0],
            lineWidth: 4,
            fillColor: [255, 127, 0],
            textFillColor: "#000",
            textLineColor: "#fff",
            textLineWidth: 3,
            opacity: 0.3,
            radius: 8
        },
        styleAvoidAreas: {
            lineColor: [0, 127, 255],
            lineWidth: 2,
            fillColor: [0, 127, 255],
            opacity: 0.3,
            pointRadius: 8,
            pointLineWidth: 4
        },
        batchProcessing: {
            enabled: false,
            active: false,
            limit: 1000,
            maximumConcurrentRequests: 3
        }
    },
    isochronesSettings: {
        type: null,
        serviceId: null,
        speedProfile: "CAR",
        isochronesMethodOption: "TIME",
        distanceValue: 30,
        minDistance: 1,
        maxDistance: 400,
        timeValue: 30,
        minTime: 1,
        maxTime: 180,
        intervalValue: 15,
        minInterval: 3,
        maxInterval: 30,
        styleCenter: {
            lineColor: [255, 127, 0],
            lineWidth: 4,
            fillColor: [255, 127, 0],
            opacity: 0.3,
            radius: 8
        },
        styleIsochrones: {
            lineWidth: 2,
            opacity: 0.65,
            startColor: [66, 245, 78],
            endColor: [245, 66, 66]
        },
        batchProcessing: {
            enabled: false,
            active: false,
            limit: 1000,
            maximumConcurrentRequests: 3
        }
    }
};

export default state;
