/**
 * User type definition
 * @typedef {Object} ShareViewState
 * @property {Boolean} active if true, ShareView will rendered
 * @property {String} id id of the ShareView component
 * @property {String} currentScale scale selected in ShareView
 * @property {String} name displayed as title (config-param)
 * @property {String} icon icon next to title (config-param)
 * @property {Boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {Boolean} resizableWindow if true, window is resizable (config-param)
 * @property {Boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {Boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 */
const state = {
    active: false,
    id: "shareView",
    // defaults for config.json parameters
    name: "common:menu.tools.shareView",
    icon: "bi-share",
    renderToWindow: true,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: false,
    // saveSelection state
    layerIds: [],
    layerTransparencies: [],
    layerVisibilities: []
};

export default state;
