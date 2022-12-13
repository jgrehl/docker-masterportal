import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";

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
     * Checks if a layer is in the map collections
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
    },

    /**
     * Checks if the layer with the given name already exists and uses it or creates a new layer and returns it if not.
     * @param {Object} context - A context object of the store instance.
     * @param {Function} context.dispatch - The dispatch function to call other actions.
     * @param {Object} context.getters - The getters of the map.
     * @param {Object} payload - The action payload.
     * @param {String} payload.layerName - The name of the new layer or the already existing layer.
     * @param {Boolean} [payload.alwaysOnTop=true] - Layers with the attribute "alwaysOnTop": true are set on top of the map.
     * @returns {module:ol/layer/Base~BaseLaye} The found layer or a new layer with the given name.
     */
    async addNewLayerIfNotExists ({dispatch, getters}, {layerName, alwaysOnTop = true}) {
        let resultLayer = await getters.getLayerByName(layerName);

        if (!resultLayer) {
            resultLayer = new VectorLayer({
                id: layerName,
                name: layerName,
                source: new VectorSource(),
                alwaysOnTop: alwaysOnTop
            });

            dispatch("addLayer", resultLayer);
        }

        return resultLayer;
    }
};
