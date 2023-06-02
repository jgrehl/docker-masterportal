const getters = {

    /**
     * Returns the center coordinates of the layer preview.
     * @param {stateLayerPreview} state Local vuex state.
     * @returns {Array} the center coordinates
     */
    previewCenter: state => id => {
        return state.center[id];
    },

    /**
     * Returns the zoom-level of the layer preview.
     * @param {stateLayerPreview} state Local vuex state.
     * @returns {number} the zoom-level
     */
    previewZoomLevel: state => id =>{
        return state.zoomLevel[id];
    }
};

export default getters;
