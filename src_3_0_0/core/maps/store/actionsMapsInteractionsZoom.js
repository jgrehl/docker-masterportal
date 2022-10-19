/**
 * Interactions with the Map and MapView that are exclusively about zooming.
 */
export default {
    /**
     * Reduces the zoom level by one.
     * @param {Object} param store context
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    decreaseZoom ({dispatch}) {
        dispatch("setZoom", mapCollection.getMapView("2D").getZoom() - 1);
    },

    /**
     * Increases the zoom level by one.
     * @param {Object} param store context
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    increaseZoom ({dispatch}) {
        dispatch("setZoom", mapCollection.getMapView("2D").getZoom() + 1);
    },

    /**
     * Sets zoom level to the map view.
     * Note: State is updated by listener.
     * @param {Object} _ store context
     * @param {Number} zoom The zoomLevel to zoom to.
     * @returns {void}
     */
    setZoom (_, zoom) {
        const view = mapCollection.getMapView("2D");

        if (zoom <= view.getMaxZoom() && zoom >= view.getMinZoom()) {
            view.setZoom(zoom);
        }
    }
};
