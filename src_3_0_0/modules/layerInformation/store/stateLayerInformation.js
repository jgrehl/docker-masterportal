/**
 * User type definition
 * @typedef {Object} layerInformationState
 * @property {Boolean} active if true LayerInformation will be shown
 * @property {Boolean} alwaysActivated This module is always activated.
 * @property {String} icon Icon next to name (config-param).
 * @property {Object[]} isVisibleInMenu Specifies a whether a menu item is to be created.
 * @property {Object[]} menuSide Specifies in which menu the GFI should be rendered
 * @property {String} name name of this module
 * @property {String} type the type of layer information
 *
 * @property {String} abstractText the abstract Info text
 * @property {String} datePublication the date of the publication
 * @property {String} dateRevision the date of the revision
 * @property {Array} downloadLinks the download Links
 * @property {Object} layerInfo additional layer Information
 * @property {String} metaDataCatalogueId id of the MateDataCatalogue
 * @property {Array} metaURLs the metadata URLs
 * @property {String} noMetadataLoaded no metadata Loaded Text
 * @property {String} periodicityKey the key for the periodicity
 * @property {Boolean} showUrlGlobal parameter to globally toggle the dispaly of the service url for all layers
 * @property {String} title the layer Title
 */
export default {
    active: false,
    alwaysActivated: true,
    icon: "bi-info-circle",
    isVisibleInMenu: false,
    menuSide: "mainMenu",
    name: "common:modules.layerInformation.informationAndLegend",
    type: "layerInformation",

    abstractText: "",
    datePublication: "",
    dateRevision: "",
    downloadLinks: null,
    layerInfo: {},
    metaDataCatalogueId: "2",
    metaURLs: [],
    noMetadataLoaded: "",
    periodicityKey: "",
    showUrlGlobal: null,
    title: ""
};
