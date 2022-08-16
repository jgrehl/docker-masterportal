import store from "../../app-store";
import layerCollection from "./layerCollection";
import LayerOl2dRasterWms from "./layerOl2dRasterWms";

const possibleLayerTypes = {
    WMS: LayerOl2dRasterWms
};

/**
 * Starts the creation of the layer in the layer factory
 * and register watcher.
 * @param {Object} visibleLayerConfigs The layer configurations.
 * @returns {void}
 */
export default function initializeLayerFactory (visibleLayerConfigs) {
    processLayerConfig(visibleLayerConfigs);
    registerLayerConfig();

    setTimeout(() => {
        store.commit("replaceByIdInLayerConfig", [{
            id: "2426",
            visibility: true,
            name: "Bezirke",
            url: "https://geodienste.hamburg.de/HH_WMS_Verwaltungsgrenzen",
            typ: "WMS",
            layers: "bezirke"
        }]);
    }, 2000);

    setTimeout(() => {
        store.commit("replaceByIdInLayerConfig", [{
            id: "453",
            visibility: false,
            abc: "test"
        }]);
    }, 5000);

    setTimeout(() => {
        store.commit("replaceByIdInLayerConfig", [{
            id: "452",
            visibility: true,
            def: "test"
        }]);
    }, 8000);
}

/**
 * Register to the layers in layerConfig.
 * @returns {void}
 */
function registerLayerConfig () {
    store.watch((state, getters) => getters.allLayerConfigs, layerConfig => {
        processLayerConfig(layerConfig);
    });
}

/**
 * Processes the layerConfig.
 * All existing layers will be updated.
 * Of the non-existing layers, only the visible ones are created and pushed into the LayerCollection.
 * @param {Object[]} layerConfig The layer configurations.
 * @returns {void}
 */
export function processLayerConfig (layerConfig) {
    layerConfig.forEach(layerConf => {
        let layer = layerCollection.getLayerById(layerConf.id);

        if (layer !== undefined) {
            updateLayerAttributes(layer, layerConf);
        }
        else if (layerConf.visibility === true) {
            layer = createLayer(layerConf);
            layerCollection.addLayer(layer);
            store.dispatch("Maps/addLayer", layer.layer);
        }
    });
}

/**
 * Creates layer instances.
 * @param {Object} layerConf The layer configuration.
 * @returns {Layer} The layer instance.
 */
export function createLayer (layerConf) {
    const typ = layerConf?.typ?.toUpperCase(),
        layer = new possibleLayerTypes[typ](layerConf);

    return layer;
}

/**
 * Update the layer attributes of the already extistering layer.
 * @param {Layer} layer Layer of the layer collection.
 * @param {Object} layerConf The layer config.
 * @returns {void}
 */
export function updateLayerAttributes (layer, layerConf) {
    Object.assign(layer.attributes, layerConf);
    layer.updateLayerValues(layer.attributes);
}

