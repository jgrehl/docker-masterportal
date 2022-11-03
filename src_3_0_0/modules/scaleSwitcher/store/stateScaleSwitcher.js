/**
 * User type definition
 * @typedef {Object} ScaleSwitcherState
 * @property {String} icon Icon next to title (config-param)
 * @property {String} id Id of the ScaleSwitcher component
 * @property {String} name Displayed as title (config-param)
 *
 * @property {Boolean} active If true, scaleSwitcher will rendered.
 * @property {Boolean} deactivateGFI The GFI will be disabled when opening this module if the attribute is true.
 * @property {Boolean} hasMouseMapInteractions If this attribute is true, then all other modules will be deactivated when this attribute is also true. Only one module with this attribute true may be open at the same time, since conflicts can arise in the card interactions.
 * @property {Boolean} isVisibleInMenu Is selectable in the menu if the attribute is true.
 * @property {String[]} supportedDevice Devices on which the module is displayed.
 * @property {String[]} supportedMapMode Map mode in which this module can be used.
 */
const state = {
    icon: "bi-arrows-angle-contract",
    id: "scaleSwitcher",
    name: "common:menu.tools.scaleSwitcher",
    title: "common:menu.tools.scaleSwitcher", // @todo gleich mit name
    itemType: "scaleSwitcher", // @todo gleich mit id

    active: false,
    deactivateGFI: false,
    hasMouseMapInteractions: false,
    isVisibleInMenu: true,
    supportedDevice: ["Desktop", "Mobil", "Table"], // @todo noch im Menü einbauen
    // supportedDevice: ["Desktop", "Mobil", "Table"], // @todo noch im Menü einbauen
    supportedMapMode: ["2D", "3D"] // @todo noch im Menü einbauen
};

export default state;
