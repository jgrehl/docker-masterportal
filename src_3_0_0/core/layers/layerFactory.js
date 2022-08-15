import store from "../../app-store";
import layerCollection from "./layerCollection";
import LayerOl2dRasterWms from "./layerOl2dRasterWms";

const possibleLayerTypes = {
    WMS: LayerOl2dRasterWms
};

/**
 * Starts the creation of the layer in the layer factory.
 * @param {Object} visibleLayerConfigs The layer configurations.
 * @returns {void}
 */
export default function runLayerFactory (visibleLayerConfigs) {
    visibleLayerConfigs.forEach(layerConf => {
        const layer = createLayer(layerConf);

        layerCollection.addLayer(layer);
        store.commit("updateVisibleLayerConfigs", layer.attributes);
    });

    registerLayerVisibility();

    // only for testing
    // setTimeout(() => {
    //     store.commit("updateVisibleLayerConfigs", {
    //         id: "2426",
    //         visibility: true,
    //         name: "Bezirke",
    //         url: "https://geodienste.hamburg.de/HH_WMS_Verwaltungsgrenzen",
    //         typ: "WMS",
    //         layers: "bezirke"
    //     });
    // }, 2000);

    // setTimeout(() => {
    //     store.commit("updateVisibleLayerConfigs", {
    //         id: "453",
    //         visibility: false,
    //         typ: "WMS",
    //         abc: "test"
    //     });
    // }, 5000);
}

/**
 * Register to visibility of layers in layerConfig
 * @returns {void}
 */
function registerLayerVisibility () {
    store.watch((state, getters) => getters.allLayerConfigs, layerConfig => {
        layerConfig.forEach(layerConf => {
            const layer = layerCollection.getLayerById(layerConf.id);

            if (layer !== undefined) {
                updateLayerAttributes(layer, layerConf);
            }
            else if (layerConf.visibility === true) {
                layerCollection.addLayer(createLayer(layerConf));
            }
        });
    });
}

/**
 * Creates layer instances.
 * @param {Object} layerConf The layer configuration.
 * @returns {Layer} The layer instance.
 */
function createLayer (layerConf) {
    const typ = layerConf?.typ?.toUpperCase();

    return new possibleLayerTypes[typ](layerConf);
}

/**
 * Update the layer attributes of the already extistering layer.
 * @param {Layer} layer Layer of the layer collection.
 * @param {Object} layerConf The layer config.
 * @returns {void}
 */
function updateLayerAttributes (layer, layerConf) {
    Object.assign(layer.attributes, layerConf);
    layer.updateLayerValues(layer.attributes);
}

