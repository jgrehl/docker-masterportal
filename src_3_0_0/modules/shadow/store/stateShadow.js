/**
 * Shadow state definition.
 * @typedef {Object} ShadowState
 * @property {Boolean} active If true, SaveSelection will be rendered.
 * @property {String} description The descritption that should be shown in the button in the menu.
 * @property {String} icon Icon next to the title. (config-param)
 * @property {String} name Displayed as the title. (config-param)
 * @property {Boolean} showDescription If true, description will be shown.
 * @property {String[]} supportedDevices Devices on which the module is displayed.
 * @property {String[]} supportedMapModes Map mode in which this module can be used.
 * @property {String} type Type of the Contact component.

 * @property {Boolean} isShadowEnabled Flag determining if the module should have shadow enabled initially. (config-param)
 * @property {Object} shadowTime Object to define start date and time. (config-param)
 */
const state = {
    active: false,
    description: "",
    icon: "bi-lamp-fill",
    name: "common:menu.tools.shadow",
    showDescription: false,
    supportedDevices: ["Desktop", "Mobile", "Table"],
    supportedMapModes: ["3D"],
    type: "shadow",

    isShadowEnabled: false,
    shadowTime: {}
};

export default state;
