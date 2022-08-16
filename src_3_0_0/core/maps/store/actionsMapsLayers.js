/**
 * Interactions with the layers of the map.
 */
export default {
    /**
     * Adds a layer to the map.
     * @param {Object} _ context object.
     * @param {module:ol/layer/Base~BaseLayer} layer The layer to add.
     * @returns {void}
     */
    addLayer (_, layer) {
        mapCollection.getMap("2D").addLayer(layer);
    }
};
