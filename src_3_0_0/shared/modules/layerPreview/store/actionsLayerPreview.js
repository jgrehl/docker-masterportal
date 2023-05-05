// import mapCanvasToImage, {exportMapView} from "../../../../../addons/cosi/utils/mapCanvasToImage";

const actions = {
    /**
     * Sets listeners for draw interaction events. On "drawend" the selected area is stored as geoJSON in the model-property "selectedAreaGeoJson".
     * @param {Object} dispatch commit vuex element
     * @param {Object} payload vuex element
     * @param {Object} payload.interaction Interaction for drawing feature geometries
     * @param {Object} payload.layer Vector data that is rendered client-side
     * @param {Object} payload.vm vue instance
     * @returns {void}
     */
    initialize: async function ({commit, getters, rootGetters}, {center, zoomLevel}) {
        if (!getters.previewCenter) {
            commit("setPreviewCenter", {center: center ? center : rootGetters["Maps/initialCenter"]});
        }
        if (!Array.isArray(getters.previewCenter)) {
            commit("setPreviewCenter", {center: [parseFloat(getters.previewCenter.split(",")[0]), parseFloat(getters.previewCenter.split(",")[1])]});
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
