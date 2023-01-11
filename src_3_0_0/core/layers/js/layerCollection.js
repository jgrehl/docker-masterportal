import Layer2d from "./layer2d";
import Layer3d from "./layer3d";
import store from "../../../app-store";

const layerCollection = [];

/**
 * Adds a layer to the layerCollection.
 * @param {Layer} layer The layer.
 * @returns {void}
 */
function addLayer (layer) {
    layerCollection.push(layer);

    if (layer instanceof Layer2d) {
        store.dispatch("Maps/addLayer", layer.getLayer());
    }
}

/**
 * Removes all entries from the collection and remove all layers from maps.
 * @returns {void}
 */
function clear () {
    layerCollection.forEach(layer => {
        if (layer instanceof Layer2d) {
            const olLayer = layer.getLayer();

            olLayer.setVisible(false);
            mapCollection.getMap("2D")?.removeLayer(olLayer);
        }
        else if (layer instanceof Layer3d) {
            layer.setVisible(false, mapCollection.getMap("3D"), layer.attributes);
        }
    });

    while (layerCollection.length > 0) {
        layerCollection.pop();
    }
}

/**
 * Gets the layerCollection
 * @returns {Layer[]} The layer collection.
 */
function getLayers () {
    return layerCollection;
}

/**
 * Returns an layer by id of the layer collection.
 * @param {String} id The layer id.
 * @returns {Layer} The layer.
 */
function getLayerById (id) {
    return layerCollection.find(layer => layer.attributes.id === id);
}

/**
 * Returns an layer by id of the layer collection.
 * @param {String} id The layer id.
 * @returns {Layer} The layer.
 */
function getOlLayers () {
    const olLayers = [];

    layerCollection.forEach(layer => {
        if (layer.getLayer().get("visible")) {
            olLayers.push(layer.getLayer());
        }
    });

    return olLayers;
}

module.exports = {
    addLayer,
    clear,
    getLayers,
    getLayerById,
    getOlLayers
};
