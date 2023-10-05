/**
* The state of the layerInformation.
 * @module modules/layerInformation/store/stateLayerInformation
 *
 * @property {String} icon Icon next to name (config-param).
 * @property {Object[]} menuSide Specifies in which menu the GFI should be rendered
 * @property {String} name name of this module
 * @property {String} type the type of layer information
 *
 * @property {String} abstractText the abstract Info text
 * @property {String} datePublication the date of the publication
 * @property {String} dateRevision the date of the revision
 * @property {string} customText the custom Info text
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
    icon: "bi-info-circle",
    menuSide: "mainMenu",
    name: "common:modules.layerInformation.name",
    type: "layerInformation",

    abstractText: "",
    customText: null,
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
