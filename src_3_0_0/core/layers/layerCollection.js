const layerCollection = [];

export default {
    /**
     * Adds a layer to the layerCollection.
     * @param {Layer} layer The layer.
     * @returns {void}
     */
    addLayer: function (layer) {
        layerCollection.push(layer);
    },

    /**
     * Gets the layerCollection
     * @returns {Layer[]} The layer collection.
     */
    getLayers: function () {
        return layerCollection;
    }
};
