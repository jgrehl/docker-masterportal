/**
 * User type definition
 * @typedef {Object} CoordToolkitState
 * @property {Boolean} active if true, CoordToolkit will rendered
 * @property {String} description The description that should be shown in the button in the right menu.
 * @property {Boolean} hasMouseMapInteractions If this attribute is true, then all other modules will be deactivated when this attribute is also true. Only one module with this attribute true may be open at the same time, since conflicts can arise in the card interactions.
 * @property {String} [mode="supply"] may be 'search' or 'supply'
 * @property {module:ol/interaction/Pointer} selectPointerMove contains interaction listener to map
 * @property {Object[]} projections list of available projections
 * @property {Object} mapProjection projection of the map
 * @property {Number[]} positionMapProjection position of the projection in the map
 * @property {Boolean} updatePosition if true, position is updated in tool
 * @property {Object} currentProjection the current projection
 * @property {boolean} eastingNoCoord true, if no coord in easting input field
 * @property {boolean} eastingNoMatch true, if coord in easting are not valid
 * @property {boolean} northingNoCoord true, if no coord in northing input field
 * @property {boolean} northingNoMatch true, if coord in northing are not valid
 * @property {Object} coordinatesEasting contains id and value of the easting input field
 * @property {Object} coordinatesNorthing contains id and value of the northing input field
 * @property {String} coordinatesEastingExample contains the example for easting coordinates
 * @property {String} coordinatesNorthingExample contains the example for northing coordinates
 * @property {Array} selectedCoordinates contains the selected coordinates
 * @property {String} height contains the value of the height input field
 * @property {module:ol/Layer}  heightLayer must be set in config.json to display the height. The layer to get the height from.
 * @property {String} heightLayerId id of the layer to get the height from
 * @property {String} [heightInfoFormat="application/vnd.ogc.gml"] infoFormat of the layers getFeatureRequest
 * @property {String} heightElementName element name in the response of getFeatureRequest of height layer
 * @property {String} heightValueWater value in the response of getFeatureRequest of height layer, if there is water area
 * @property {String} heightValueBuilding value in the response of getFeatureRequest of height layer, if there is building area
 * @property {Boolean} showCopyButtons if true, copy-buttons are shown
 * @property {String} delimiter delimits the copies coordinates
 * @property {String} zoomLevel used by search
 * @property {String} name displayed as title (config-param)
 * @property {String} icon icon next to title (config-param)
 * @property {Boolean} showDescription If true, description will be shown.
 */
const state = {
    icon: "bi-globe",
    hasMouseMapInteractions: true,
    name: "common:menu.tools.coordToolkit",
    type: "coordToolkit",
    active: false,
    description: "",
    showDescription: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],

    mode: "supply",
    selectPointerMove: null,
    projections: [],
    mapProjection: null,
    positionMapProjection: [],
    updatePosition: true,
    currentProjection: {id: "http://www.opengis.net/gml/srs/epsg.xml#25832", name: "EPSG:25832", projName: "utm"},
    eastingNoCoord: false,
    eastingNoMatch: false,
    northingNoCoord: false,
    northingNoMatch: false,
    coordinatesEasting: {id: "easting", value: ""},
    coordinatesNorthing: {id: "northing", value: ""},
    coordinatesEastingExample: "",
    coordinatesNorthingExample: "",
    selectedCoordinates: [],
    height: "",
    heightLayer: null,
    zoomLevel: 7,
    heightLayerId: null,
    heightInfoFormat: "application/vnd.ogc.gml",
    heightElementName: null,
    heightValueWater: null,
    heightValueBuilding: null,
    showCopyButtons: true,
    delimiter: "|"
};

export default state;
