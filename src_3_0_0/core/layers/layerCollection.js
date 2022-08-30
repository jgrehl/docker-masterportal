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
     * Removes all entries from the collection.
     * @returns {void}
     */
    clear: function () {
        layerCollection.length = 0;
    },

    /**
     * Gets the layerCollection
     * @returns {Layer[]} The layer collection.
     */
    getLayers: function () {
        return layerCollection;
    },

    /**
     * Returns an layer by id of the layer collection.
     * @param {String} id The layer id.
     * @returns {Layer} The layer.
     */
    getLayerById: function (id) {
        return layerCollection.find(layer => layer.attributes.id === id);
    }
};
