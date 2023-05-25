
const mutations = {
    /**
     * Sets the center coordinates of the layer preview.
     * @param {Object} state current state
     * @param {Array} center  the center coordinates
     * @returns {void}
     */
    setPreviewCenter (state, {center}) {
        state.center = center;
    },

    /**
     * Sets the zoom-level of the layer preview.
     * @param {Object} state current state
     * @param {number} zoomLevel the zoom-level
     * @returns {void}
     */
    setPreviewZoomLevel (state, {zoomLevel}) {
        state.zoomLevel = zoomLevel;
    }

};

export default mutations;
