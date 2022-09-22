/**
 * User type definition
 * @typedef {Object} ScaleSwitcherState
 * @property {String} icon Icon next to title (config-param)
 * @property {String} id Id of the ScaleSwitcher component
 * @property {String} name Displayed as title (config-param)
 *
 * @property {Boolean} active If true, scaleSwitcher will rendered
 * @property {Boolean} isVisibleInMenu If true, tool is selectable in menu (config-param)
 * @property {Boolean} deactivateGFI Flag if tool should deactivate gfi (config-param)
 * @property {Boolean} supportedDevice Devices on which the module is displayed
 */
const state = {
    icon: "bi-arrows-angle-contract",
    id: "scaleSwitcher",
    name: "common:menu.tools.scaleSwitcher",

    active: false,
    deactivateGFI: false,
    isVisibleInMenu: true,
    supportedDevice: ["Desktop", "Mobil", "Table"]
};

export default state;
