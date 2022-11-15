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
        const map2D = mapCollection.getMap("2D");

        if (!map2D.getLayers().getArray().includes(layer)) {
            map2D.addLayer(layer);
        }
        else {
            console.warn(`The layer with Id: ${layer.get("id")} was not added to the map, because the layer already exists!`);
        }
    },

    /**
     * Adds a layer to the map.
     * @param {Object} _ context object.
     * @param {module:ol/layer/Base~BaseLayer} layer The layer to check.
     * @returns {Boolean} if layer exists in mapCollection
     */
    checkLayer (_, layer) {
        const map2D = mapCollection.getMap("2D");

        if (map2D.getLayers().getArray().includes(layer)) {
            return true;
        }
        return false;
    }
};
