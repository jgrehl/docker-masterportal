/**
 * WfsSearch tool state definition.
 * @typedef {object} WfsSearchState
 * @type {object}
 * @property {boolean} type the type of the module.
 * @property {string} name Displayed as the title. (config-param)
 * @property {string} icon Icon next to the title. (config-param)
 * @property {Object[]} instances Array of search configurations. Each object contains the parameters literals, requestConfig and title and may also contain the parameters selectSource and userHelp. More information in the documentation.
 * @property {number} currentInstanceIndex Position of the current search instance in the instances array.
 * @property {?JSON} parsedSource The requested and parsed selectSource.
 * @property {?object} requiredValues The key value pairs for the required fields.
 * @property {string} userHelp IInformation text regarding the search formular to be displayed to the user.
 * @property {ol.Feature[]} results Current results of the search query.
 * @property {boolean} searched Whether the search button has been clicked.
 * @property {object} selectedOptions The values of options which the user has entered / selected a value. The options here present are only the fields which had the parameter "options" as a String. The values inserted, have its "options" parameter as the key and the input as the value.
 * @property {?object} service An object containing information about the WFS service, which will later be filtered.
 * @property {boolean} showResultList Whether the modal containing the results should be shown.
 * @property {boolean} valuesReset If the values are reset, no values should be set on a select element.
 * @property {number} zoomLevel zoom level to switch to on focusing a result
 * @property {number} resultsPerPage used for pagination
 * @property {boolean} multiSelect whether multiple result list entries may be selected
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 */
const state = {
    type: "wfsSearch",
    // defaults for config.json tool parameters
    name: "common:menu.tools.wfsSearch",
    icon: "bi-search",
    instances: [],
    // state parameters
    currentInstanceIndex: 0,
    parsedSource: null,
    requiredValues: null,
    userHelp: "",
    results: [],
    searched: false,
    selectedOptions: {},
    service: null,
    showResultList: false,
    valuesReset: false,
    zoomLevel: 5,
    resultsPerPage: 0,
    multiSelect: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"]
};

export default state;
