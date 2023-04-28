/**
 * User type definition
 * @typedef {Object}    LegendState
 * @property {String}   type - The type of the module.
 * @property {String}   description - The description that should be shown in the button in the right menu.
 * @property {Boolean}  showDescription - If true, description is shown.
 * @property {String}   icon - icon next to title
 * @property {String}   name - Displayed as title (config-param)
 * @property {Boolean}  hasMouseMapInteractions If this attribute is true, then all other modules will be deactivated when this attribute is also true. Only one module with this attribute true may be open at the same time, since conflicts can arise in the card interactions.
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes - Map mode in which this module can be used.
 * @property {Array}    legends - Contains infos about each legend.
 * @property {Array}    waitingLegendsInfos - Contains layers waiting for load end to show in layer information.
 * @property {Object}   layerInfoLegend - to show in layer information.
 * @property {Object}   preparedLegend - the prepared legend.
 *
 */

export default {
    type: "legend",
    icon: "bi-lightbulb",
    hasMouseMapInteractions: false,
    name: "common:modules.legend.name",
    description: "",
    showDescription: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["2D", "3D"],

    legends: [],
    waitingLegendsInfos: [],
    layerInfoLegend: {},
    preparedLegend: null
};
