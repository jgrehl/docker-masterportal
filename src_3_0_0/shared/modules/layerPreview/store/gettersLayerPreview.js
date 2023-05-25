const getters = {

    /**
     * Returns the center coordinates of the layer preview.
     * @param {stateLayerPreview} state Local vuex state.
     * @returns {Array} the center coordinates
     */
    previewCenter: state => {
        return state.center;
    },

    /**
     * Returns the zoom-level of the layer preview.
     * @param {stateLayerPreview} state Local vuex state.
     * @returns {number} the zoom-level
     */
    previewZoomLevel: state => {
        return state.zoomLevel;
    }
};

export default getters;
