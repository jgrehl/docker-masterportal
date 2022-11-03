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
    },

    /**
     * Zoom to a given extent
     * @param {Object} _ store context.
     * @param {Object} payload parameter object.
     * @param {String[]} payload.extent The extent to zoom.
     * @param {Object} payload.options Options for zoom.
     * @param {Number} [payload.options.duration=800] The duration of the animation in milliseconds.
     * @see {@link https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit} for more options.
     * @returns {void}
     */
    zoomToExtent (_, {extent, options}) {
        mapCollection.getMapView("2D").fit(extent, {
            size: mapCollection.getMap("2D").getSize(),
            ...Object.assign({duration: 800}, options)
        });
    }
};
