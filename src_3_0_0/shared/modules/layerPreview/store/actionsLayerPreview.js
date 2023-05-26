const actions = {
    /**
     * Sets previewCenter and previewZoomlevel depening on given center and zoomlevel or initial values from map.
     * @param {Object} param.commit the commit
     * @param {Object} param.getters the getters
     * @param {Object} param.rootGetters the rootGetters
     * @param {Object} payload the payload
     * @param {Array|String} payload.center center coordinates
     * @param {Number} payload.zoomLevel the zoom level
     * @returns {void}
     */
    initialize: async function ({commit, getters, rootGetters}, {center, zoomLevel}) {
        const previewCenter = center ? center : rootGetters["Maps/initialCenter"];

        if (!Array.isArray(previewCenter) && typeof previewCenter === "string" && previewCenter.indexOf(",") > -1) {
            commit("setPreviewCenter", {center: [parseFloat(previewCenter.split(",")[0]), parseFloat(previewCenter.split(",")[1])]});
        }
        else if (!getters.previewCenter) {
            commit("setPreviewCenter", {center: previewCenter});
        }
        if (!getters.previewZoomLevel) {
            commit("setPreviewZoomLevel", {zoomLevel: zoomLevel ? zoomLevel : rootGetters["Maps/initialZoom"]});
        }
        else {
            commit("setPreviewZoomLevel", {zoomLevel: parseInt(getters.previewZoomLevel, 10)});
        }
    }
};

export default actions;
