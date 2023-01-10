/**
 * User type definition
 * @typedef {Object} FileImportState
 * @property {Boolean}  active - if true, component is rendered
 * @property {String}   description - The description that should be shown in the button in the right menu.
 * @property {Boolean}  enableZoomToExtend - If true, it is enable to zoom to features of the imported file.
 * @property {Object}   featureExtents - the Feature Extents.
 * @property {String}   icon - icon next to title
 * @property {String[]} importedFileNames - list of names of successfully imported files
 * @property {Object}   layer - the layer
 * @property {String}   name - Displayed as title (config-param)
 * @property {String}   selectedFiletype - This controls, which openlayers format is used when displaying the file data. Using "auto" will result in selecting one format according to the filename's suffix.
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {Object}   supportedFiletypes - Configuration object which is used to generate the selectedFiletype radio form from.
 * @property {String[]} supportedMapModes - Map mode in which this module can be used.
 * @property {String}   type - The type of the module.
 */

export default {
    active: false,
    description: "",
    enableZoomToExtend: false,
    featureExtents: {},
    icon: "bi-box-arrow-in-down",
    importedFileNames: [],
    layer: undefined,
    name: "common:menu.tools.fileImport",
    selectedFiletype: "auto",
    showDescription: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedFiletypes: {
        auto: {
            caption: "common:modules.tools.fileImport.captions.supportedFiletypes.auto"
        },
        kml: {
            caption: "common:modules.tools.fileImport.captions.supportedFiletypes.kml",
            rgx: /\.kml$/i
        },
        gpx: {
            caption: "common:modules.tools.fileImport.captions.supportedFiletypes.gpx",
            rgx: /\.gpx$/i
        },
        geojson: {
            caption: "common:modules.tools.fileImport.captions.supportedFiletypes.geojson",
            rgx: /\.(geo)?json$/i
        }
    },
    supportedMapModes: ["2D", "3D"],
    type: "fileImport"
};
