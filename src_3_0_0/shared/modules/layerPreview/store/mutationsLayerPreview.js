
const mutations = {
    /**
     * Sets the center coordinates of the layer preview.
     * @param {Object} state current state
     * @param {Array} center  the center coordinates
     * @returns {void}
     */
    setPreviewCenter (state, {id, center}) {
        state.center[id] = center;
    },

    /**
     * Sets the zoom-level of the layer preview.
     * @param {Object} state current state
     * @param {number} zoomLevel the zoom-level
     * @returns {void}
     */
    setPreviewZoomLevel (state, {id, zoomLevel}) {
        state.zoomLevel[id] = zoomLevel;
    }

};

export default mutations;
